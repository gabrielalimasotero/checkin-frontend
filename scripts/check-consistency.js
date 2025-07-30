#!/usr/bin/env node

/**
 * Script para verificar a consistência do design system
 * 
 * Uso: node scripts/check-consistency.js
 */

const fs = require('fs');
const path = require('path');

// Classes que devem ser evitadas (inconsistentes)
const INCONSISTENT_CLASSES = {
  spacing: [
    'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10', 'p-12',
    'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-8', 'm-10', 'm-12',
    'space-y-1', 'space-y-2', 'space-y-3', 'space-y-4', 'space-y-5', 'space-y-6', 'space-y-8',
    'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-5', 'gap-6', 'gap-8'
  ],
  typography: [
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
    'font-normal', 'font-medium', 'font-semibold', 'font-bold',
    'leading-none', 'leading-tight', 'leading-normal', 'leading-relaxed'
  ],
  layout: [
    'flex', 'grid', 'block', 'inline', 'inline-block',
    'items-center', 'items-start', 'items-end',
    'justify-center', 'justify-start', 'justify-end', 'justify-between'
  ]
};

// Classes recomendadas do design system
const RECOMMENDED_CLASSES = {
  spacing: [
    'space-xs', 'space-sm', 'space-md', 'space-lg', 'space-xl', 'space-2xl',
    'p-xs', 'p-sm', 'p-md', 'p-lg', 'p-xl', 'p-2xl',
    'm-xs', 'm-sm', 'm-md', 'm-lg', 'm-xl', 'm-2xl'
  ],
  typography: [
    'text-heading', 'text-body', 'text-caption', 'text-label'
  ],
  cards: [
    'card-compact', 'card-standard', 'card-spacious', 'card-elevated'
  ],
  buttons: [
    'btn-primary', 'btn-secondary', 'btn-ghost', 'btn-outline'
  ],
  layout: [
    'container-mobile', 'section-spacing', 'section-spacing-lg',
    'pageHeader', 'sectionHeader', 'formSection', 'formField', 'formActions',
    'listItem', 'listItemCompact', 'navItem', 'navItemActive'
  ]
};

// Função para escanear arquivos
function scanFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Pular node_modules e .git
        if (item !== 'node_modules' && item !== '.git' && !item.startsWith('.')) {
          scan(fullPath);
        }
      } else if (extensions.includes(path.extname(item))) {
        files.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return files;
}

// Função para analisar um arquivo
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Verificar classes inconsistentes
  for (const category in INCONSISTENT_CLASSES) {
    for (const className of INCONSISTENT_CLASSES[category]) {
      const regex = new RegExp(`\\b${className}\\b`, 'g');
      const matches = content.match(regex);
      
      if (matches) {
        issues.push({
          type: 'inconsistent',
          category,
          className,
          count: matches.length,
          recommendation: getRecommendation(category, className)
        });
      }
    }
  }
  
  // Verificar uso de classes recomendadas
  const usedRecommended = [];
  for (const category in RECOMMENDED_CLASSES) {
    for (const className of RECOMMENDED_CLASSES[category]) {
      const regex = new RegExp(`\\b${className}\\b`, 'g');
      const matches = content.match(regex);
      
      if (matches) {
        usedRecommended.push({
          category,
          className,
          count: matches.length
        });
      }
    }
  }
  
  return {
    file: filePath,
    issues,
    usedRecommended,
    totalIssues: issues.length
  };
}

// Função para obter recomendação
function getRecommendation(category, className) {
  const recommendations = {
    spacing: {
      'p-3': 'Use p-md ou card-compact',
      'p-4': 'Use p-lg ou card-standard',
      'p-6': 'Use p-xl ou card-spacious',
      'space-y-4': 'Use space-lg',
      'space-y-3': 'Use space-md',
      'space-y-2': 'Use space-sm'
    },
    typography: {
      'text-sm': 'Use text-caption ou text-label',
      'text-lg': 'Use text-heading',
      'font-semibold': 'Use text-heading',
      'text-muted-foreground': 'Use text-caption'
    }
  };
  
  return recommendations[category]?.[className] || 'Use classes do design system';
}

// Função principal
function main() {
  console.log('🔍 Verificando consistência do design system...\n');
  
  const srcDir = path.join(process.cwd(), 'src');
  const files = scanFiles(srcDir);
  
  let totalIssues = 0;
  const allIssues = [];
  const allRecommendations = [];
  
  for (const file of files) {
    const analysis = analyzeFile(file);
    
    if (analysis.issues.length > 0) {
      allIssues.push(analysis);
      totalIssues += analysis.totalIssues;
    }
    
    if (analysis.usedRecommended.length > 0) {
      allRecommendations.push(analysis);
    }
  }
  
  // Relatório de problemas
  if (allIssues.length > 0) {
    console.log('❌ Problemas encontrados:');
    console.log('=' .repeat(50));
    
    for (const analysis of allIssues) {
      console.log(`\n📁 ${path.relative(process.cwd(), analysis.file)}`);
      
      const groupedIssues = {};
      for (const issue of analysis.issues) {
        if (!groupedIssues[issue.className]) {
          groupedIssues[issue.className] = {
            count: 0,
            recommendation: issue.recommendation
          };
        }
        groupedIssues[issue.className].count += issue.count;
      }
      
      for (const [className, info] of Object.entries(groupedIssues)) {
        console.log(`  • ${className} (${info.count}x) → ${info.recommendation}`);
      }
    }
    
    console.log(`\n📊 Total de problemas: ${totalIssues}`);
  } else {
    console.log('✅ Nenhum problema encontrado!');
  }
  
  // Relatório de boas práticas
  if (allRecommendations.length > 0) {
    console.log('\n✅ Boas práticas encontradas:');
    console.log('=' .repeat(50));
    
    const goodPractices = {};
    for (const analysis of allRecommendations) {
      for (const rec of analysis.usedRecommended) {
        if (!goodPractices[rec.className]) {
          goodPractices[rec.className] = 0;
        }
        goodPractices[rec.className] += rec.count;
      }
    }
    
    for (const [className, count] of Object.entries(goodPractices)) {
      console.log(`  ✅ ${className} (${count}x)`);
    }
  }
  
  // Sugestões gerais
  console.log('\n💡 Sugestões para melhorar a consistência:');
  console.log('=' .repeat(50));
  console.log('1. Use as constantes do design system:');
  console.log('   import { COMPONENT_VARIANTS, COMMON_CLASSES } from "@/lib/design-system"');
  console.log('\n2. Prefira classes semânticas:');
  console.log('   • card-standard em vez de p-4');
  console.log('   • text-heading em vez de text-lg font-semibold');
  console.log('   • space-lg em vez de space-y-4');
  console.log('\n3. Use layouts comuns:');
  console.log('   • pageHeader para cabeçalhos de página');
  console.log('   • formSection para seções de formulário');
  console.log('   • listItem para itens de lista');
  
  console.log('\n📖 Consulte o guia: DESIGN_SYSTEM_GUIDE.md');
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { scanFiles, analyzeFile, getRecommendation }; 