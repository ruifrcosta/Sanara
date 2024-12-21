import { ProcessManager } from './ProcessManager';
import { logger } from '../utils/logger';

export class BackgroundTaskService {
  private processManager: ProcessManager;

  constructor() {
    this.processManager = new ProcessManager();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Monitorar saída dos processos
    this.processManager.on('data', ({ pid, type, data }) => {
      if (type === 'stdout') {
        logger.debug(`Background task ${pid} output:`, data);
      } else {
        logger.error(`Background task ${pid} error:`, data);
      }
    });

    // Monitorar finalização dos processos
    this.processManager.on('exit', ({ pid, code, signal }) => {
      logger.info(`Background task ${pid} finished with code ${code} and signal ${signal}`);
    });

    // Monitorar erros dos processos
    this.processManager.on('error', ({ pid, error }) => {
      logger.error(`Background task ${pid} error:`, error);
    });
  }

  async processImageOptimization(imagePath: string): Promise<number> {
    try {
      // Executar otimização de imagem em background
      const pid = await this.processManager.executeCommand('node', [
        'scripts/optimize-image.js',
        imagePath
      ], {
        maxMemory: 256, // 256 MB
        timeout: 60000, // 1 minuto
      });

      logger.info(`Started image optimization task with PID ${pid}`);
      return pid;
    } catch (error) {
      logger.error('Error starting image optimization task:', error);
      throw error;
    }
  }

  async generateProductReport(filters: Record<string, any>): Promise<number> {
    try {
      // Executar geração de relatório em background
      const pid = await this.processManager.executeCommand('node', [
        'scripts/generate-report.js',
        '--type=product',
        `--filters=${JSON.stringify(filters)}`
      ], {
        maxMemory: 512, // 512 MB
        timeout: 300000, // 5 minutos
      });

      logger.info(`Started report generation task with PID ${pid}`);
      return pid;
    } catch (error) {
      logger.error('Error starting report generation task:', error);
      throw error;
    }
  }

  async processDataImport(filePath: string): Promise<number> {
    try {
      // Executar importação de dados em background
      const pid = await this.processManager.executeCommand('node', [
        'scripts/import-data.js',
        filePath
      ], {
        maxMemory: 1024, // 1 GB
        timeout: 600000, // 10 minutos
      });

      logger.info(`Started data import task with PID ${pid}`);
      return pid;
    } catch (error) {
      logger.error('Error starting data import task:', error);
      throw error;
    }
  }

  async processDataExport(filters: Record<string, any>): Promise<number> {
    try {
      // Executar exportação de dados em background
      const pid = await this.processManager.executeCommand('node', [
        'scripts/export-data.js',
        `--filters=${JSON.stringify(filters)}`
      ], {
        maxMemory: 1024, // 1 GB
        timeout: 600000, // 10 minutos
      });

      logger.info(`Started data export task with PID ${pid}`);
      return pid;
    } catch (error) {
      logger.error('Error starting data export task:', error);
      throw error;
    }
  }

  getTaskStatus(pid: number): { status: string; info: any } {
    const info = this.processManager.getProcessInfo(pid);
    if (!info) {
      return { status: 'not_found', info: null };
    }
    return { status: info.status, info };
  }

  getAllTasks(): Array<{ pid: number; info: any }> {
    return this.processManager.getAllProcesses().map(info => ({
      pid: info.pid,
      info
    }));
  }

  killTask(pid: number): void {
    this.processManager.killProcess(pid);
    logger.info(`Killed background task ${pid}`);
  }
} 