#!/usr/bin/env python3
"""
Script para iniciar o projeto Império Modas localmente.
Autor: Andrew Maia
"""

import subprocess
import sys
import os
import platform
import webbrowser
import time
import shutil

def print_header():
    print("\n" + "="*50)
    print("       IMPÉRIO MODAS - Servidor Local")
    print("="*50 + "\n")

def check_node():
    """Verifica se o Node.js está instalado"""
    if shutil.which("node") is None:
        print("[ERRO] Node.js não está instalado!")
        print("\nPara instalar o Node.js:")
        print("  - Windows: https://nodejs.org/pt-br/download/")
        print("  - Mac: brew install node")
        print("  - Linux: sudo apt install nodejs npm")
        return False
    
    result = subprocess.run(["node", "--version"], capture_output=True, text=True)
    print(f"[OK] Node.js encontrado: {result.stdout.strip()}")
    return True

def check_pnpm():
    """Verifica se o pnpm está instalado"""
    if shutil.which("pnpm") is None:
        print("[INFO] pnpm não encontrado. Instalando...")
        try:
            subprocess.run(["npm", "install", "-g", "pnpm"], check=True)
            print("[OK] pnpm instalado com sucesso!")
        except subprocess.CalledProcessError:
            print("[AVISO] Não foi possível instalar pnpm. Usando npm...")
            return False
    else:
        result = subprocess.run(["pnpm", "--version"], capture_output=True, text=True)
        print(f"[OK] pnpm encontrado: {result.stdout.strip()}")
    return True

def install_dependencies(use_pnpm=True):
    """Instala as dependências do projeto"""
    print("\n[INFO] Instalando dependências...")
    
    try:
        if use_pnpm:
            subprocess.run(["pnpm", "install"], check=True)
        else:
            subprocess.run(["npm", "install"], check=True)
        print("[OK] Dependências instaladas!\n")
        return True
    except subprocess.CalledProcessError as e:
        print(f"[ERRO] Falha ao instalar dependências: {e}")
        return False

def start_server(use_pnpm=True):
    """Inicia o servidor de desenvolvimento"""
    print("\n" + "-"*50)
    print("Iniciando servidor de desenvolvimento...")
    print("-"*50)
    print("\nAcesse: http://localhost:3000")
    print("Admin:  http://localhost:3000/admin")
    print("\nCredenciais do Admin:")
    print("  Usuario: admin")
    print("  Senha:   admin123")
    print("\nPressione Ctrl+C para parar o servidor")
    print("-"*50 + "\n")
    
    # Aguarda um pouco e abre o navegador
    def open_browser():
        time.sleep(3)
        webbrowser.open("http://localhost:3000")
    
    import threading
    browser_thread = threading.Thread(target=open_browser)
    browser_thread.start()
    
    try:
        if use_pnpm:
            subprocess.run(["pnpm", "dev"])
        else:
            subprocess.run(["npm", "run", "dev"])
    except KeyboardInterrupt:
        print("\n\n[INFO] Servidor encerrado pelo usuário.")

def main():
    print_header()
    
    # Muda para o diretório do script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    print(f"[INFO] Diretório do projeto: {script_dir}\n")
    
    # Verifica requisitos
    if not check_node():
        input("\nPressione Enter para sair...")
        sys.exit(1)
    
    use_pnpm = check_pnpm()
    
    # Verifica se node_modules existe
    if not os.path.exists("node_modules"):
        if not install_dependencies(use_pnpm):
            input("\nPressione Enter para sair...")
            sys.exit(1)
    else:
        print("[OK] Dependências já instaladas (node_modules existe)")
    
    # Inicia o servidor
    start_server(use_pnpm)

if __name__ == "__main__":
    main()
