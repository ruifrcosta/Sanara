import { spawn, ChildProcess } from 'child_process';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';

interface ProcessOptions {
  maxMemory?: number; // em MB
  timeout?: number; // em ms
  maxBuffer?: number; // em bytes
  cwd?: string;
}

interface ProcessInfo {
  pid: number;
  command: string;
  startTime: Date;
  status: 'running' | 'completed' | 'failed';
  exitCode?: number;
  memory?: number;
}

export class ProcessManager extends EventEmitter {
  private processes: Map<number, ChildProcess> = new Map();
  private processInfo: Map<number, ProcessInfo> = new Map();
  private readonly defaultOptions: ProcessOptions = {
    maxMemory: 512, // 512 MB
    timeout: 30000, // 30 segundos
    maxBuffer: 1024 * 1024 * 10, // 10 MB
  };

  constructor() {
    super();
    this.monitorProcesses();
  }

  async executeCommand(
    command: string,
    args: string[],
    options: ProcessOptions = {}
  ): Promise<number> {
    const mergedOptions = { ...this.defaultOptions, ...options };

    try {
      const childProcess = spawn(command, args, {
        cwd: mergedOptions.cwd,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          NODE_OPTIONS: `--max-old-space-size=${mergedOptions.maxMemory}`
        }
      });

      const processInfo: ProcessInfo = {
        pid: childProcess.pid!,
        command: `${command} ${args.join(' ')}`,
        startTime: new Date(),
        status: 'running'
      };

      this.processes.set(childProcess.pid!, childProcess);
      this.processInfo.set(childProcess.pid!, processInfo);

      // Configurar timeout
      const timeoutId = setTimeout(() => {
        this.killProcess(childProcess.pid!, 'SIGTERM');
      }, mergedOptions.timeout);

      // Capturar saída padrão
      childProcess.stdout?.on('data', (data) => {
        logger.debug(`Process ${childProcess.pid} stdout:`, data.toString());
        this.emit('data', { pid: childProcess.pid, type: 'stdout', data: data.toString() });
      });

      // Capturar erros
      childProcess.stderr?.on('data', (data) => {
        logger.error(`Process ${childProcess.pid} stderr:`, data.toString());
        this.emit('data', { pid: childProcess.pid, type: 'stderr', data: data.toString() });
      });

      // Tratar finalização do processo
      childProcess.on('exit', (code, signal) => {
        clearTimeout(timeoutId);
        const info = this.processInfo.get(childProcess.pid!);
        if (info) {
          info.status = code === 0 ? 'completed' : 'failed';
          info.exitCode = code || undefined;
          this.processInfo.set(childProcess.pid!, info);
        }
        this.processes.delete(childProcess.pid!);
        this.emit('exit', { pid: childProcess.pid, code, signal });
      });

      // Tratar erros do processo
      childProcess.on('error', (error) => {
        clearTimeout(timeoutId);
        logger.error(`Process ${childProcess.pid} error:`, error);
        this.emit('error', { pid: childProcess.pid, error });
      });

      return childProcess.pid!;
    } catch (error) {
      logger.error('Error executing command:', error);
      throw error;
    }
  }

  killProcess(pid: number, signal: NodeJS.Signals = 'SIGTERM'): void {
    const process = this.processes.get(pid);
    if (process) {
      process.kill(signal);
      this.processes.delete(pid);
      const info = this.processInfo.get(pid);
      if (info) {
        info.status = 'failed';
        info.exitCode = -1;
        this.processInfo.set(pid, info);
      }
    }
  }

  getProcessInfo(pid: number): ProcessInfo | undefined {
    return this.processInfo.get(pid);
  }

  getAllProcesses(): ProcessInfo[] {
    return Array.from(this.processInfo.values());
  }

  private monitorProcesses(): void {
    setInterval(() => {
      this.processes.forEach((process, pid) => {
        try {
          // Verificar uso de memória
          const usage = process.memoryUsage?.();
          if (usage) {
            const info = this.processInfo.get(pid);
            if (info) {
              info.memory = Math.round(usage.heapUsed / 1024 / 1024); // Converter para MB
              this.processInfo.set(pid, info);

              // Verificar limite de memória
              if (info.memory > (this.defaultOptions.maxMemory || 512)) {
                logger.warn(`Process ${pid} exceeded memory limit. Killing process...`);
                this.killProcess(pid);
              }
            }
          }
        } catch (error) {
          logger.error(`Error monitoring process ${pid}:`, error);
        }
      });
    }, 5000); // Monitorar a cada 5 segundos
  }
} 