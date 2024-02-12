const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get all versions of @splinetool/loader
const versions = execSync('npm view @splinetool/loader versions --json', {
  encoding: 'utf8',
});
const versionsJsonPath = path.join(
  __dirname,
  'splineloader-three-mapping.json'
);
const parsedVersions = JSON.parse(versions);

const checkedVersions = JSON.parse(fs.readFileSync(versionsJsonPath, 'utf8'));
const notCheckedVersions = parsedVersions.filter(
  (ver) => !checkedVersions[ver]
);
console.log('Versions to check:', notCheckedVersions);

// For each version
for (const version of notCheckedVersions) {
  console.log(`Processing version ${version}...`);

  // Install the package
  execSync(`pnpm add @splinetool/loader@${version}`, { stdio: 'ignore' });

  // Read the package.json file
  const packageJsonPath = path.join(
    __dirname,
    '../',
    'node_modules',
    '@splinetool/loader',
    'package.json'
  );
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  fs.writeFileSync(
    versionsJsonPath,
    JSON.stringify(
      { ...checkedVersions, [version]: packageJson.devDependencies.three },
      null,
      2
    )
  );
  console.log(`Done`);
}
