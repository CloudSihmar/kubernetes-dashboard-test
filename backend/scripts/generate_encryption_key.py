#!/usr/bin/env python3
"""Generate a secure encryption key for the application"""

from cryptography.fernet import Fernet

if __name__ == "__main__":
    key = Fernet.generate_key()
    print("Generated Encryption Key:")
    print(key.decode())
    print("\nAdd this to your .env file:")
    print(f"ENCRYPTION_KEY={key.decode()}")
