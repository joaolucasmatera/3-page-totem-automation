#!/usr/bin/env node
// Script de teste para validar configuração de variáveis de ambiente

require('dotenv').config();

console.log('🔍 TESTE DE CONFIGURAÇÃO - Web Automation');
console.log('═'.repeat(55));

// Verificar variáveis obrigatórias
const requiredVars = [
    'PRODUCTION_EMAIL', 'PRODUCTION_PASSWORD',
    'STAGING_EMAIL', 'STAGING_PASSWORD',
    'DASHBOARD_URL', 'PROFILE_URL', 'STAGING_URL'
];

let allConfigured = true;

console.log('\n📋 CREDENCIAIS:');
console.log('─'.repeat(30));

// Production
const prodEmail = process.env.PRODUCTION_EMAIL;
const prodPass = process.env.PRODUCTION_PASSWORD;
console.log(`Production Email: ${prodEmail ? '✅ ' + prodEmail : '❌ Não configurado'}`);
console.log(`Production Password: ${prodPass ? '✅ Configurado (' + prodPass.length + ' caracteres)' : '❌ Não configurado'}`);

// Staging
const stagEmail = process.env.STAGING_EMAIL;
const stagPass = process.env.STAGING_PASSWORD;
console.log(`Staging Email: ${stagEmail ? '✅ ' + stagEmail : '❌ Não configurado'}`);
console.log(`Staging Password: ${stagPass ? '✅ Configurado (' + stagPass.length + ' caracteres)' : '❌ Não configurado'}`);

console.log('\n🌐 URLS:');
console.log('─'.repeat(30));
console.log(`Dashboard: ${process.env.DASHBOARD_URL ? '✅ ' + process.env.DASHBOARD_URL : '❌ Não configurado'}`);
console.log(`Profile: ${process.env.PROFILE_URL ? '✅ ' + process.env.PROFILE_URL : '❌ Não configurado'}`);
console.log(`Staging: ${process.env.STAGING_URL ? '✅ ' + process.env.STAGING_URL : '❌ Não configurado'}`);

// Verificar se todas estão configuradas
const missingVars = requiredVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    allConfigured = false;
    console.log('\n❌ VARIÁVEIS FALTANDO:');
    console.log('─'.repeat(30));
    missingVars.forEach(varName => console.log(`  • ${varName}`));
    console.log('\n💡 SOLUÇÃO: Configure no arquivo .env');
}

console.log('\n🎯 RESULTADO FINAL:');
console.log('═'.repeat(55));

if (allConfigured) {
    console.log('✅ CONFIGURAÇÃO PERFEITA!');
    console.log('🚀 Sistema pronto para execução');
    console.log('📌 Execute: .\\run-automation.bat');
} else {
    console.log('❌ CONFIGURAÇÃO INCOMPLETA');
    console.log('📝 Edite o arquivo .env com suas credenciais');
    console.log('💡 Use .env.example como referência');
}

console.log('\n' + '═'.repeat(55));
