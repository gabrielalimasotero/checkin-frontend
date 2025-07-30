import React from 'react';
import { Card } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { 
  COMPONENT_VARIANTS, 
  COMMON_CLASSES, 
  LAYOUT,
  INTERACTIVE 
} from '@/lib/design-system';

/**
 * Componente de exemplo demonstrando o uso consistente do design system
 * Este componente serve como referência para outros desenvolvedores
 */
export const DesignSystemExample = () => {
  return (
    <div className={LAYOUT.container}>
      {/* Page Header */}
      <div className={COMMON_CLASSES.pageHeader}>
        <h1 className="text-heading">Design System</h1>
        <Button variant="outline" size="sm">Configurar</Button>
      </div>

      {/* Typography Section */}
      <section className={LAYOUT.section}>
        <h2 className={COMMON_CLASSES.sectionHeader}>
          <span className="text-heading">Tipografia</span>
        </h2>
        
        <div className={COMPONENT_VARIANTS.spacing.lg}>
          <h1>Heading 1 - Título Principal</h1>
          <h2>Heading 2 - Subtítulo</h2>
          <h3>Heading 3 - Seção</h3>
          <h4>Heading 4 - Subseção</h4>
          <p className="text-body">
            Texto do corpo - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <small className="text-caption">
            Texto pequeno - Informações secundárias
          </small>
        </div>
      </section>

      {/* Spacing Section */}
      <section className={LAYOUT.section}>
        <h2 className={COMMON_CLASSES.sectionHeader}>
          <span className="text-heading">Espaçamentos</span>
        </h2>
        
        <div className={COMPONENT_VARIANTS.spacing.lg}>
          <div className="space-xs">
            <div className="bg-primary/10 p-2 rounded">Espaçamento XS</div>
            <div className="bg-primary/10 p-2 rounded">Espaçamento XS</div>
          </div>
          
          <div className="space-sm">
            <div className="bg-primary/10 p-2 rounded">Espaçamento SM</div>
            <div className="bg-primary/10 p-2 rounded">Espaçamento SM</div>
          </div>
          
          <div className="space-md">
            <div className="bg-primary/10 p-2 rounded">Espaçamento MD</div>
            <div className="bg-primary/10 p-2 rounded">Espaçamento MD</div>
          </div>
          
          <div className="space-lg">
            <div className="bg-primary/10 p-2 rounded">Espaçamento LG</div>
            <div className="bg-primary/10 p-2 rounded">Espaçamento LG</div>
          </div>
        </div>
      </section>

      {/* Card Variants Section */}
      <section className={LAYOUT.section}>
        <h2 className={COMMON_CLASSES.sectionHeader}>
          <span className="text-heading">Variantes de Card</span>
        </h2>
        
        <div className={COMMON_CLASSES.cardGrid}>
          <Card className={COMPONENT_VARIANTS.card.compact}>
            <h4 className="text-heading mb-2">Card Compact</h4>
            <p className="text-caption">Padding reduzido para listas densas</p>
          </Card>
          
          <Card className={COMPONENT_VARIANTS.card.standard}>
            <h4 className="text-heading mb-2">Card Standard</h4>
            <p className="text-caption">Padding padrão para conteúdo geral</p>
          </Card>
          
          <Card className={COMPONENT_VARIANTS.card.spacious}>
            <h4 className="text-heading mb-2">Card Spacious</h4>
            <p className="text-caption">Padding amplo para destaque</p>
          </Card>
          
          <Card className={COMPONENT_VARIANTS.card.elevated}>
            <h4 className="text-heading mb-2">Card Elevated</h4>
            <p className="text-caption">Com sombra e hover effect</p>
          </Card>
        </div>
      </section>

      {/* Button Variants Section */}
      <section className={LAYOUT.section}>
        <h2 className={COMMON_CLASSES.sectionHeader}>
          <span className="text-heading">Variantes de Botão</span>
        </h2>
        
        <div className={COMPONENT_VARIANTS.spacing.lg}>
          <div className="flex flex-wrap gap-2">
            <Button className={COMPONENT_VARIANTS.button.primary}>
              Primary
            </Button>
            <Button className={COMPONENT_VARIANTS.button.secondary}>
              Secondary
            </Button>
            <Button className={COMPONENT_VARIANTS.button.outline}>
              Outline
            </Button>
            <Button className={COMPONENT_VARIANTS.button.ghost}>
              Ghost
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Elements Section */}
      <section className={LAYOUT.section}>
        <h2 className={COMMON_CLASSES.sectionHeader}>
          <span className="text-heading">Elementos Interativos</span>
        </h2>
        
        <div className={COMMON_CLASSES.cardList}>
          <Card className={`${COMPONENT_VARIANTS.card.standard} ${INTERACTIVE.card}`}>
            <div className={COMMON_CLASSES.listItem}>
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="text-heading">João Silva</h4>
                <p className="text-caption">Online agora</p>
              </div>
              <Badge variant="secondary">Novo</Badge>
            </div>
          </Card>
          
          <Card className={`${COMPONENT_VARIANTS.card.standard} ${INTERACTIVE.card}`}>
            <div className={COMMON_CLASSES.listItem}>
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face" />
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="text-heading">Maria Santos</h4>
                <p className="text-caption">Há 5 minutos</p>
              </div>
              <Badge variant="default">Ativo</Badge>
            </div>
          </Card>
        </div>
      </section>

      {/* Form Example Section */}
      <section className={LAYOUT.section}>
        <h2 className={COMMON_CLASSES.sectionHeader}>
          <span className="text-heading">Exemplo de Formulário</span>
        </h2>
        
        <Card className={COMPONENT_VARIANTS.card.spacious}>
          <div className={COMMON_CLASSES.formSection}>
            <div className={COMMON_CLASSES.formField}>
              <label className="text-label">Nome</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md mt-1"
                placeholder="Digite seu nome"
              />
            </div>
            
            <div className={COMMON_CLASSES.formField}>
              <label className="text-label">Email</label>
              <input 
                type="email" 
                className="w-full p-2 border rounded-md mt-1"
                placeholder="Digite seu email"
              />
            </div>
            
            <div className={COMMON_CLASSES.formActions}>
              <Button variant="outline">Cancelar</Button>
              <Button className={COMPONENT_VARIANTS.button.primary}>
                Salvar
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default DesignSystemExample; 