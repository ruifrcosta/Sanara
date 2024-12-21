import logging
import sys
from typing import Any, Dict
from app.config import settings

# Configure logging format
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=settings.LOG_LEVEL,
    handlers=[logging.StreamHandler(sys.stdout)]
)

class Logger:
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
    
    def info(self, message: str, extra: Dict[str, Any] = None):
        self.logger.info(message, extra=extra)
    
    def error(self, message: str, error: Exception = None, extra: Dict[str, Any] = None):
        if error:
            self.logger.error(f"{message}: {str(error)}", exc_info=True, extra=extra)
        else:
            self.logger.error(message, extra=extra)
    
    def warning(self, message: str, extra: Dict[str, Any] = None):
        self.logger.warning(message, extra=extra)
    
    def debug(self, message: str, extra: Dict[str, Any] = None):
        self.logger.debug(message, extra=extra)

def get_logger(name: str) -> Logger:
    return Logger(name) 