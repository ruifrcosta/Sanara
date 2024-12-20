const { spawn } = require('child_process');
const reportGenerator = require('../src/tests/helpers/generateReport');
const path = require('path');
const fs = require('fs').promises;

async function runTests() {
  console.log('🚀 Iniciando testes...');
  
  try {
    // Limpa diretório de relatórios
    const reportsDir = path.join(process.cwd(), 'reports');
    await fs.mkdir(reportsDir, { recursive: true });
    
    const files = await fs.readdir(reportsDir);
    for (const file of files) {
      await fs.unlink(path.join(reportsDir, file));
    }

    // Executa testes
    const testProcess = spawn('jest', [
      '--coverage',
      '--json',
      '--outputFile=./reports/jest-results.json'
    ], {
      stdio: 'inherit'
    });

    return new Promise((resolve, reject) => {
      testProcess.on('close', async (code) => {
        if (code !== 0) {
          console.error('❌ Testes falharam');
          reject(new Error(`Processo de teste terminou com código ${code}`));
          return;
        }

        try {
          console.log('📊 Gerando relatórios...');
          
          // Lê resultados dos testes
          const resultsPath = path.join(process.cwd(), 'reports', 'jest-results.json');
          const results = JSON.parse(await fs.readFile(resultsPath, 'utf8'));
          
          // Gera relatório detalhado
          await reportGenerator.generateReport(results);
          
          console.log('✅ Testes e relatórios concluídos com sucesso!');
          console.log(`
            📋 Sumário:
            Total de Testes: ${results.numTotalTests}
            Passou: ${results.numPassedTests}
            Falhou: ${results.numFailedTests}
            Pulou: ${results.numPendingTests}
            
            📁 Relatórios gerados em:
            - reports/detailed-report.html
            - reports/detailed-report.json
            - reports/error-report.json
            - reports/coverage/
          `);
          
          resolve();
        } catch (error) {
          console.error('❌ Erro ao gerar relatórios:', error);
          reject(error);
        }
      });

      testProcess.on('error', (error) => {
        console.error('❌ Erro ao executar testes:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

// Executa os testes
runTests().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
}); 