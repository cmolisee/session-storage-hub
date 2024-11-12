"""config class"""
#  jkpy/config_manager.py

from pathlib import Path
import json

class configManager():
    """Config file manager"""
    def __init__(self):
        """initialize object"""
        config_path = Path.home() / "Documents" / ".jkpy" / "config.txt"
        config_path.parent.mkdir(parents=True, exist_ok=True)
        
        if not config_path.exists():
            config_path.touch()
        self.config_file_path = config_path
        
    def _json(self):
        """get as json"""
        try:
            with self.config_file_path.open("r") as f:
                data = f.read()
                
            return {} if data == "" else json.loads(data)
        except Exception as e:
            raise e
    
    def get(self, k: str):
        """Get value by key"""
        if self.config_file_path.exists():
            try:
                data = self._json()
                
                if k in data:
                    return data[k]
            except Exception as e:
                return None
        return None

    def set(self, k: str, v: str):
        """Set value for key"""
        if not self.config_file_path.exists():
            try:
                with self.config_file_path.open("w") as f:
                    f.write(json.dumps({ k: v }))
            except Exception as e:
                raise e
        else:
            try:
                data = self._get_json()
                
                data[k] = v
                with self.config_file_path.open("w") as f:
                    f.write(json.dumps(data))
            except Exception as e:
                raise e

    def delete(self, k: str):
        """Delete key"""
        if not self.config_file_path.exists():
            return
        
        try:
            data = self._get_json()
                
            del data[k]
            with self.config_file_path.open("w") as f:
                f.write(json.dumps(data))
        except Exception as e:
            raise e

    def delete_config(self):
        """Delete the entire config"""
        if self.config_file_path.exists():
            self.config_file_path.unlink()
