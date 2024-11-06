import queue
from threading import Thread
        
class state():
    def __init__(self):
        self.s = {}
    
    def get_item(self, key: str):
        if key in self.s:
            return self.s[key]
        return None
    
    def set_item(self, key: str, value: any):
        self.s[key] = value

class taskProcessor():
    def __init__(self, num_threads):
        self.queue = queue.Queue()
        self.threads = []
        self.results = []
        for _ in range(num_threads):
            thread = Thread(target=self._worker)
            thread.daemon = True
            thread.start()
            self.threads.append(thread)
            
    def add_task(self, task, *args, **kwargs):
        """Add task to queue for processing"""
        self.queue.put((task, args, kwargs))
            
    def _worker(self):
        while True:
            task, args, kwargs = self.queue.get()
            try:
                self.results.append(task(*args, **kwargs))
            except Exception as e:
                print(f"Task failed: {e}")
            finally:
                self.queue.task_done()
    
    def join(self):
        self.queue.join()
        res = self.results
        self.results.clear()
        return res
    
def get_key_given_value(dct: dict, v: int) -> str:
    return next((key for key, value in dct.items() if value == v), None)