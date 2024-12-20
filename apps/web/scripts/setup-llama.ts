import { exec } from 'child_process';
import { promisify } from 'util';
import { downloadAllModels } from '../src/utils/llama/modelManager';

const execAsync = promisify(exec);

async function setupLlama() {
  try {
    console.log('Installing Llama CLI...');
    await execAsync('pip install llama-stack -U');

    console.log('Creating virtual environment...');
    await execAsync('python -m venv .venv');

    console.log('Activating virtual environment...');
    if (process.platform === 'win32') {
      await execAsync('.venv\\Scripts\\activate');
    } else {
      await execAsync('source .venv/bin/activate');
    }

    console.log('Installing Python dependencies...');
    await execAsync('pip install -r requirements.txt');

    console.log('Downloading Llama models...');
    await downloadAllModels();

    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  }
}

setupLlama(); 