const { execSync } = require('child_process');
const readline = require('readline');

const migrationName = process.argv[2];

function runMigration(name) {
  if (!name) {
    console.error('Se debe pasar el nombre de la migración');
    process.exit(1);
  }
  const command = [
    'ts-node',
    '-r tsconfig-paths/register',
    './node_modules/typeorm/cli.js',
    'migration:generate',
    '-d ./src/database/database.config.ts',
    `./src/database/migrations/${name}`
  ].join(' ');
  execSync(command, { stdio: 'inherit' });
}

if (migrationName) {
  runMigration(migrationName);
} else {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Ingresar nombre de la migración (No usar espaciado): ', answer => {
    rl.close();
    runMigration(answer.trim());
  });
}
