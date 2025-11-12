@echo off
title Publicar Site Dinâmica do Sonho
echo ==========================================================
echo  🚀 PUBLICADOR AUTOMÁTICO - DINÂMICA DO SONHO (Gilliardp)
echo ==========================================================
echo.

REM ====== Caminho do projeto ======
cd /d "D:\C.S.O\Desktop\Projetos\dinamica-do-sonho-site"

echo [1/7] Inicializando o repositório Git...
git init

echo [2/7] Adicionando arquivos...
git add .

echo [3/7] Criando commit inicial...
git commit -m "Versão inicial do site Dinâmica do Sonho com painel admin e IA"

echo [4/7] Definindo branch principal...
git branch -M main

echo [5/7] Adicionando repositório remoto...
git remote remove origin 2>nul
git remote add origin https://github.com/Gilliardp/dinamica-do-sonho.git

echo [6/7] Enviando arquivos para o GitHub...
git push -u origin main

echo.
echo ==========================================================
echo  ✅ Concluído!
echo  Verifique seu repositório em:
echo  https://github.com/Gilliardp/dinamica-do-sonho
echo ==========================================================
pause
