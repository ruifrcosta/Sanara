const fs = require('fs');
const path = require('path');
const winston = require('winston');

class TestReportGenerator {
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: './reports/report-error.log', level: 'error' }),
        new winston.transports.File({ filename: './reports/report-combined.log' })
      ]
    });
  }

  async generateReport(testResults) {
    try {
      const report = {
        timestamp: new Date().toISOString(),
        summary: {
          total: testResults.numTotalTests,
          passed: testResults.numPassedTests,
          failed: testResults.numFailedTests,
          skipped: testResults.numPendingTests,
          duration: testResults.testResults.reduce((acc, result) => acc + result.perfStats.runtime, 0)
        },
        suites: this.processSuites(testResults.testResults),
        coverage: testResults.coverageMap,
        environment: this.getEnvironmentInfo(),
        errors: this.processErrors(testResults.testResults)
      };

      // Gera relatório HTML
      await this.generateHtmlReport(report);

      // Gera relatório JSON
      await this.generateJsonReport(report);

      // Gera relatório de erros
      await this.generateErrorReport(report.errors);

      this.logger.info('Relatórios gerados com sucesso');
      return report;
    } catch (error) {
      this.logger.error('Erro ao gerar relatórios', { error });
      throw error;
    }
  }

  processSuites(testResults) {
    return testResults.map(suite => ({
      name: suite.testFilePath,
      duration: suite.perfStats.runtime,
      status: this.getSuiteStatus(suite),
      tests: suite.testResults.map(test => ({
        title: test.title,
        status: test.status,
        duration: test.duration,
        failureMessages: test.failureMessages
      }))
    }));
  }

  getSuiteStatus(suite) {
    if (suite.testResults.some(test => test.status === 'failed')) {
      return 'failed';
    }
    if (suite.testResults.every(test => test.status === 'passed')) {
      return 'passed';
    }
    return 'partial';
  }

  processErrors(testResults) {
    const errors = [];
    testResults.forEach(suite => {
      suite.testResults
        .filter(test => test.status === 'failed')
        .forEach(test => {
          errors.push({
            suite: suite.testFilePath,
            test: test.title,
            messages: test.failureMessages,
            location: this.parseErrorLocation(test.failureMessages[0])
          });
        });
    });
    return errors;
  }

  parseErrorLocation(errorMessage) {
    if (!errorMessage) return null;
    const match = errorMessage.match(/\((.+):(\d+):(\d+)\)/);
    return match ? {
      file: match[1],
      line: parseInt(match[2]),
      column: parseInt(match[3])
    } : null;
  }

  getEnvironmentInfo() {
    return {
      platform: process.platform,
      nodeVersion: process.version,
      cpus: require('os').cpus().length,
      memory: process.memoryUsage(),
      env: process.env.NODE_ENV
    };
  }

  async generateHtmlReport(report) {
    const template = this.getHtmlTemplate();
    const html = template.replace('{{DATA}}', JSON.stringify(report, null, 2));
    await fs.promises.writeFile(
      path.join(process.cwd(), 'reports', 'detailed-report.html'),
      html
    );
  }

  async generateJsonReport(report) {
    await fs.promises.writeFile(
      path.join(process.cwd(), 'reports', 'detailed-report.json'),
      JSON.stringify(report, null, 2)
    );
  }

  async generateErrorReport(errors) {
    const errorReport = {
      timestamp: new Date().toISOString(),
      totalErrors: errors.length,
      errors: errors.map(error => ({
        ...error,
        stack: error.messages[0],
        type: this.getErrorType(error.messages[0])
      }))
    };

    await fs.promises.writeFile(
      path.join(process.cwd(), 'reports', 'error-report.json'),
      JSON.stringify(errorReport, null, 2)
    );
  }

  getErrorType(errorMessage) {
    if (!errorMessage) return 'Unknown';
    if (errorMessage.includes('AssertionError')) return 'Assertion';
    if (errorMessage.includes('TypeError')) return 'Type';
    if (errorMessage.includes('ReferenceError')) return 'Reference';
    return 'Runtime';
  }

  getHtmlTemplate() {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório Detalhado de Testes - Sanara</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; }
            .failed { color: red; }
            .passed { color: green; }
            .skipped { color: orange; }
            .error-details { margin-top: 20px; }
            pre { background: #f8f8f8; padding: 10px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1>Relatório Detalhado de Testes - Sanara</h1>
          <div id="report"></div>
          <script>
            const data = {{DATA}};
            document.getElementById('report').innerHTML = formatReport(data);

            function formatReport(data) {
              return `
                <div class="summary">
                  <h2>Sumário</h2>
                  <p>Total: ${data.summary.total}</p>
                  <p class="passed">Passou: ${data.summary.passed}</p>
                  <p class="failed">Falhou: ${data.summary.failed}</p>
                  <p class="skipped">Pulou: ${data.summary.skipped}</p>
                  <p>Duração: ${data.summary.duration}ms</p>
                </div>
                ${formatSuites(data.suites)}
                ${formatErrors(data.errors)}
              `;
            }

            function formatSuites(suites) {
              return suites.map(suite => `
                <div class="suite">
                  <h3>${suite.name}</h3>
                  <p>Status: <span class="${suite.status}">${suite.status}</span></p>
                  <p>Duração: ${suite.duration}ms</p>
                  ${formatTests(suite.tests)}
                </div>
              `).join('');
            }

            function formatTests(tests) {
              return tests.map(test => `
                <div class="test">
                  <p>${test.title} - <span class="${test.status}">${test.status}</span></p>
                  ${test.failureMessages.length ? `
                    <pre>${test.failureMessages.join('\n')}</pre>
                  ` : ''}
                </div>
              `).join('');
            }

            function formatErrors(errors) {
              if (!errors.length) return '';
              return `
                <div class="error-details">
                  <h2>Erros Detalhados</h2>
                  ${errors.map(error => `
                    <div class="error">
                      <h4>${error.test}</h4>
                      <p>Arquivo: ${error.suite}</p>
                      ${error.location ? `
                        <p>Linha: ${error.location.line}, Coluna: ${error.location.column}</p>
                      ` : ''}
                      <pre>${error.messages.join('\n')}</pre>
                    </div>
                  `).join('')}
                </div>
              `;
            }
          </script>
        </body>
      </html>
    `;
  }
}

module.exports = new TestReportGenerator(); 