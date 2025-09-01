// SCRIPT 1: Automação completa com Playwright
// Abre 3 janelas, faz login automático, navega para URLs específicas
// e configura automaticamente o período de análise do Dashboard para 90 dias

const { chromium } = require('playwright');
require('dotenv').config();

// Verificar se variáveis de ambiente estão configuradas
const requiredEnvVars = [
    'PRODUCTION_EMAIL', 'PRODUCTION_PASSWORD',
    'STAGING_EMAIL', 'STAGING_PASSWORD',
    'DASHBOARD_URL', 'PROFILE_URL', 'STAGING_URL',
    'PRODUCTION_LOGIN_URL', 'STAGING_LOGIN_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.error('❌ ERRO: Variáveis de ambiente não configuradas!');
    console.error('📋 Variáveis faltando:', missingVars.join(', '));
    console.error('💡 Copie .env.example para .env e configure suas credenciais');
    process.exit(1);
}

const INSTANCES = [
    {
        name: "Dashboard",
        targetUrl: process.env.DASHBOARD_URL,
        windowTitle: "Dashboard",
        credentials: {
            username: process.env.PRODUCTION_EMAIL,
            password: process.env.PRODUCTION_PASSWORD
        }
    },
    {
        name: "Perfil",
        targetUrl: process.env.PROFILE_URL,
        windowTitle: "Perfil",
        credentials: {
            username: process.env.PRODUCTION_EMAIL,
            password: process.env.PRODUCTION_PASSWORD
        }
    },
    {
        name: "Staging Reviewer",
        targetUrl: process.env.STAGING_URL,
        windowTitle: "Staging",
        credentials: {
            username: process.env.STAGING_EMAIL,
            password: process.env.STAGING_PASSWORD
        }
    }
];

class MylogbookAutomation {
    constructor() {
        this.browsers = [];
        this.contexts = [];
        this.pages = [];
    }

    async createBrowserInstance(instance, index) {
        console.log(`🚀 Criando instância: ${instance.name}`);
        
        const browser = await chromium.launch({
            headless: false,
            args: [
                '--start-maximized',
                '--disable-infobars',
                '--no-first-run',
                '--disable-default-browser-check'
            ]
        });

        const context = await browser.newContext({
            viewport: null // Usar tamanho da janela
        });

        const page = await context.newPage();

        this.browsers.push(browser);
        this.contexts.push(context);
        this.pages.push(page);

        return { browser, context, page };
    }

    async performLogin(page, instance) {
        console.log(`🔐 Fazendo login para ${instance.name}...`);
        
        try {
            // Determinar URL de login baseado no ambiente usando variáveis
            const loginUrl = instance.targetUrl.includes('staging') 
                ? process.env.STAGING_LOGIN_URL 
                : process.env.PRODUCTION_LOGIN_URL;
            
            console.log(`🌐 Acessando: ${loginUrl}`);
            
            // Ir para página de login
            await page.goto(loginUrl, { waitUntil: 'networkidle', timeout: 30000 });
            
            // Aguardar campos de login (sem modal no Playwright!)
            await page.waitForSelector('input[type="email"]', { timeout: 15000 });
            
            // Preencher credenciais específicas da instância
            await page.fill('input[type="email"]', instance.credentials.username);
            await page.fill('input[type="password"]', instance.credentials.password);
            
            console.log(`📝 Credenciais preenchidas para ${instance.name}: ${instance.credentials.username}`);
            
            // Clicar em Entrar e aguardar navegação
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
                page.click('button:has-text("Entrar")')
            ]);
            
            console.log(`✅ Login realizado com sucesso: ${instance.name}`);
            
        } catch (error) {
            console.error(`❌ Erro no login de ${instance.name}:`, error.message);
            throw error;
        }
    }

    async configureDashboardPeriod(page) {
        console.log('⏱️  Configurando período de análise para 90 dias...');
        
        try {
            // Aguardar o carregamento do dashboard
            await page.waitForSelector('p:has-text("Período de análise:")', { timeout: 10000 });
            
            // Clicar no seletor de período atual
            await page.click('p:has-text("dias")');
            console.log('📋 Menu de período aberto');
            
            // Aguardar o menu aparecer e clicar em "90 dias"
            await page.waitForSelector('a:has-text("90 dias")', { timeout: 5000 });
            await page.click('a:has-text("90 dias")');
            console.log('📊 Período alterado para 90 dias');
            
            // Aguardar recalculo dos dados
            await page.waitForTimeout(2000);
            console.log('✅ Configuração de período concluída');
            
        } catch (error) {
            console.log('⚠️  Não foi possível configurar período automaticamente:', error.message);
            // Não falhar o processo, apenas avisar
        }
    }

    async navigateToTarget(page, instance) {
        console.log(`🎯 Navegando para ${instance.name}: ${instance.targetUrl}`);
        
        try {
            await page.goto(instance.targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
            
            // Definir título da janela para identificação
            await page.evaluate((title) => {
                document.title = title;
            }, instance.windowTitle);
            
            // Se for Dashboard, configurar período de 90 dias
            if (instance.name === "Dashboard") {
                await this.configureDashboardPeriod(page);
            }
            
            console.log(`✅ ${instance.name} carregado com sucesso`);
            
        } catch (error) {
            console.error(`❌ Erro na navegação de ${instance.name}:`, error.message);
            throw error;
        }
    }

    async automateInstance(instance, index) {
        try {
            // Criar browser
            const { page } = await this.createBrowserInstance(instance, index);
            
            // Fazer login
            await this.performLogin(page, instance);
            
            // Navegar para URL específica
            await this.navigateToTarget(page, instance);
            
            return { name: instance.name, success: true, page };
            
        } catch (error) {
            console.error(`❌ Falha na instância ${instance.name}:`, error.message);
            return { name: instance.name, success: false, error: error.message };
        }
    }

    async runAll() {
        console.log('🎬 AUTOMAÇÃO WEB - 3 INSTÂNCIAS');
        console.log('═'.repeat(50));
        console.log('✨ Chrome limpo (sem modais de instalação)');
        console.log('🔐 Login automático em todas as instâncias');
        console.log('🎯 Navegação para URLs específicas');
        console.log('⏱️  Dashboard configurado para período de 90 dias');
        console.log('');

        try {
            // Executar todas as instâncias sequencialmente (para evitar conflitos)
            const results = [];
            
            for (let i = 0; i < INSTANCES.length; i++) {
                const instance = INSTANCES[i];
                console.log(`\n--- Processando ${instance.name} (${i + 1}/3) ---`);
                
                const result = await this.automateInstance(instance, i);
                results.push(result);
                
                // Pausa entre instâncias
                if (i < INSTANCES.length - 1) {
                    console.log('⏳ Aguardando 3 segundos...');
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            }
            
            // Relatório final
            console.log('\n📊 RELATÓRIO FINAL');
            console.log('═'.repeat(50));
            
            let successCount = 0;
            results.forEach(result => {
                if (result.success) {
                    console.log(`✅ ${result.name}: Funcionando perfeitamente`);
                    successCount++;
                } else {
                    console.log(`❌ ${result.name}: ${result.error}`);
                }
            });
            
            console.log(`\n🎉 RESULTADO: ${successCount}/${INSTANCES.length} instâncias ativas`);
            
            if (successCount === INSTANCES.length) {
                console.log('\n🎯 TODAS AS INSTÂNCIAS FUNCIONANDO!');
                console.log('💡 Agora execute o script PowerShell para organizar as janelas');
                console.log('   Comando: npm run organize-windows');
            }
            
            return results;
            
        } catch (error) {
            console.error('💥 Erro fatal na automação:', error);
            return [];
        }
    }

    async keepAlive() {
        // Manter todas as janelas abertas indefinidamente
        console.log('� Mantendo janelas abertas... (Pressione Ctrl+C para fechar)');
        
        // Loop infinito para manter o processo ativo
        while (true) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Check a cada 10 segundos
            
            // Verificar se ainda temos browsers ativos
            let activeBrowsers = 0;
            for (const browser of this.browsers) {
                try {
                    const contexts = browser.contexts();
                    if (contexts.length > 0) activeBrowsers++;
                } catch {
                    // Browser foi fechado manualmente
                }
            }
            
            if (activeBrowsers === 0) {
                console.log('📴 Todas as janelas foram fechadas. Finalizando...');
                break;
            }
        }
    }
}

async function main() {
    const automation = new MylogbookAutomation();
    
    try {
        const results = await automation.runAll();
        
        // Se teve sucesso, manter janelas abertas
        const successCount = results.filter(r => r.success).length;
        if (successCount > 0) {
            console.log('\n⏳ MANTENDO JANELAS ABERTAS...');
            console.log('💡 Execute "npm run organize-windows" em outro terminal');
            console.log('⚠️  Para fechar, pressione Ctrl+C neste terminal');
            
            // Manter processo vivo
            await automation.keepAlive();
        }
        
        console.log('\n🏁 Automação finalizada!');
        
    } catch (error) {
        console.error('💥 Erro fatal:', error);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    main();
}

module.exports = { MylogbookAutomation };
