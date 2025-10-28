import sys
import traceback
import importlib

sys.path.append(r'C:\Users\aftab\OneDrive\Desktop\hear-my-voice-companion-main\hear-my-voice-companion-main')
importlib.invalidate_caches()
print('sys.path appended, attempting to import app')
try:
    import app
    print('Imported app successfully')
    # If app has attributes, print summary
    print('App attributes:', [a for a in dir(app) if not a.startswith('_')][:20])
except Exception:
    print('Import failed, traceback:')
    traceback.print_exc()
