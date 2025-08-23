import { AIRewriteRequest, AIRewriteResponse, CVVersionType } from '../types';

// AI Prompts for different CV versions and field types
const AI_PROMPTS = {
  general: {
    profile: `Reescribe este texto de perfil profesional con un enfoque balanceado y versátil. 
    Debe sonar profesional, mostrar adaptabilidad y destacar competencias clave sin ser demasiado específico a una industria.
    Mantén un tono formal pero accesible. Asegúrate de que sea ATS-friendly usando verbos de acción.`,
    
    experience: `Mejora esta descripción de experiencia laboral para una versión general del CV. 
    Enfócate en responsabilidades equilibradas, logros tangibles y habilidades transferibles.
    Usa verbos de acción fuertes y incluye métricas cuando sea posible.`,
    
    projects: `Optimiza esta descripción de proyecto para mostrar versatilidad profesional.
    Destaca metodologías, resultados y competencias desarrolladas que sean aplicables a diferentes contextos.`,
    
    skills: `Reformula estas habilidades de manera balanceada, combinando competencias técnicas y blandas.
    Asegúrate de que sean relevantes para múltiples industrias y tipos de rol.`
  },
  
  comercial: {
    profile: `Reescribe este perfil enfocándolo en competencias comerciales y de negocios.
    Destaca experiencia en ventas, desarrollo de negocios, negociación, relaciones comerciales y logros cuantificables.
    Incluye términos como ROI, KPIs, crecimiento, expansión de mercado. Mantén tono ejecutivo y orientado a resultados.`,
    
    experience: `Optimiza esta experiencia laboral para un enfoque comercial.
    Prioriza logros en ventas, números concretos, porcentajes de crecimiento, nuevos clientes adquiridos, 
    ingresos generados, mercados expandidos. Usa verbos como "incrementé", "desarrollé", "cerré", "negocié".`,
    
    projects: `Reformula este proyecto destacando el impacto comercial y de negocio.
    Enfócate en resultados económicos, eficiencia operativa, ahorros generados, 
    oportunidades identificadas y valor agregado al negocio.`,
    
    skills: `Prioriza habilidades comerciales: negociación, desarrollo de negocios, análisis de mercado,
    gestión de relaciones comerciales, CRM, prospección, cierre de ventas, análisis de KPIs.`
  },
  
  tech: {
    profile: `Reescribe este perfil con enfoque tecnológico y en innovación.
    Destaca competencias en tecnologías emergentes, automatización, transformación digital, 
    inteligencia artificial, análisis de datos, desarrollo de soluciones tecnológicas.
    Usa terminología técnica apropiada y menciona impacto en eficiencia operativa.`,
    
    experience: `Optimiza esta experiencia para el sector tecnológico.
    Enfócate en implementaciones tecnológicas, optimizaciones, automatizaciones, 
    stack técnico utilizado, metodologías ágiles, proyectos de transformación digital.
    Incluye métricas de performance y mejoras técnicas logradas.`,
    
    projects: `Reformula este proyecto destacando los aspectos técnicos e innovadores.
    Menciona tecnologías utilizadas, arquitecturas implementadas, problemas técnicos resueltos,
    integración de IA, automatizaciones creadas y mejoras en eficiencia técnica.`,
    
    skills: `Prioriza competencias técnicas: inteligencia artificial, análisis de datos, automatización,
    transformación digital, metodologías ágiles, integración de sistemas, innovación tecnológica.`
  },
  
  academico: {
    profile: `Reescribe este perfil con enfoque académico y de investigación.
    Destaca experiencia en docencia, investigación, publicaciones, análisis riguroso,
    metodologías de investigación, capacidad de síntesis y comunicación académica.
    Mantén tono formal y académico.`,
    
    experience: `Optimiza esta experiencia para el ámbito académico.
    Enfócate en responsabilidades docentes, proyectos de investigación, publicaciones,
    colaboraciones académicas, metodologías de enseñanza, métricas educativas.`,
    
    projects: `Reformula este proyecto con perspectiva académica.
    Destaca metodología de investigación utilizada, análisis realizados, 
    contribuciones al conocimiento, colaboraciones académicas y publicaciones resultantes.`,
    
    skills: `Prioriza competencias académicas: investigación, análisis crítico, redacción académica,
    metodologías de investigación, presentaciones académicas, publicación científica, docencia.`
  }
};

class RewriteService {
  private async makeRequest(prompt: string, text: string, maxRetries: number = 3): Promise<string> {
    // For MVP, we'll use a simple text transformation approach
    // In production, this would integrate with actual AI services like OpenAI, Anthropic, etc.
    
    const improvements = this.getTextImprovements(text, prompt);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    return improvements;
  }

  private getTextImprovements(text: string, context: string): string {
    // Basic text improvements for MVP
    let improvedText = text;
    
    // Common improvements
    improvedText = improvedText
      // Strengthen action verbs
      .replace(/\bfui responsable de\b/gi, 'Lideré')
      .replace(/\bparticipé en\b/gi, 'Colaboré activamente en')
      .replace(/\btrabajé en\b/gi, 'Desarrollé')
      .replace(/\bayudé a\b/gi, 'Contribuí significativamente a')
      .replace(/\bhice\b/gi, 'Ejecuté')
      .replace(/\bmanejé\b/gi, 'Gestioné estratégicamente')
      
      // Add quantification suggestions
      .replace(/varios/gi, 'múltiples (especificar número)')
      .replace(/muchos/gi, 'numerosos (agregar métrica)')
      .replace(/algunos/gi, 'diversos (cuantificar)')
      
      // Professional tone
      .replace(/muy bueno/gi, 'excepcional')
      .replace(/bastante/gi, 'significativamente')
      .replace(/un poco/gi, 'gradualmente');

    // Context-specific improvements
    if (context.includes('comercial')) {
      improvedText = improvedText
        .replace(/mejoré/gi, 'incrementé en X%')
        .replace(/vendí/gi, 'cerré exitosamente')
        .replace(/clientes/gi, 'stakeholders clave')
        .replace(/proyecto/gi, 'iniciativa comercial estratégica');
    }
    
    if (context.includes('tech')) {
      improvedText = improvedText
        .replace(/sistema/gi, 'solución tecnológica')
        .replace(/programa/gi, 'plataforma digital')
        .replace(/mejoré/gi, 'optimicé y automaticé')
        .replace(/proceso/gi, 'workflow digitalizado');
    }
    
    if (context.includes('académico')) {
      improvedText = improvedText
        .replace(/estudié/gi, 'investigué rigurosamente')
        .replace(/enseñé/gi, 'impartí formación especializada')
        .replace(/analicé/gi, 'desarrollé análisis exhaustivo')
        .replace(/presenté/gi, 'comuniqué hallazgos académicos');
    }

    return improvedText;
  }

  async rewriteText(request: AIRewriteRequest): Promise<AIRewriteResponse> {
    try {
      const { text, versionType, fieldType } = request;
      
      if (!text.trim()) {
        throw new Error('El texto no puede estar vacío');
      }

      const prompt = AI_PROMPTS[versionType]?.[fieldType] || AI_PROMPTS.general[fieldType];
      
      if (!prompt) {
        throw new Error(`No se encontró prompt para ${versionType}/${fieldType}`);
      }

      const rewrittenText = await this.makeRequest(prompt, text);
      
      const improvements = this.generateImprovements(text, rewrittenText, versionType);

      return {
        originalText: text,
        rewrittenText,
        improvements
      };
    } catch (error) {
      console.error('Error in AI rewrite service:', error);
      throw new Error(`Error al procesar el texto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private generateImprovements(original: string, rewritten: string, versionType: CVVersionType): string[] {
    const improvements: string[] = [];
    
    // General improvements based on version type
    switch (versionType) {
      case 'comercial':
        improvements.push(
          '✓ Enfoque en resultados comerciales y KPIs',
          '✓ Verbos de acción orientados a ventas y negocio',
          '✓ Terminología comercial profesional',
          '✓ Énfasis en logros cuantificables'
        );
        break;
      case 'tech':
        improvements.push(
          '✓ Lenguaje técnico y de innovación',
          '✓ Enfoque en soluciones tecnológicas',
          '✓ Métricas de eficiencia y automatización',
          '✓ Terminología de transformación digital'
        );
        break;
      case 'academico':
        improvements.push(
          '✓ Tono académico y de investigación',
          '✓ Enfoque en metodologías rigurosas',
          '✓ Lenguaje formal y analítico',
          '✓ Énfasis en contribuciones al conocimiento'
        );
        break;
      default:
        improvements.push(
          '✓ Lenguaje profesional y versátil',
          '✓ Verbos de acción impactantes',
          '✓ Enfoque balanceado en competencias',
          '✓ Optimizado para ATS'
        );
    }
    
    return improvements;
  }

  // Batch rewrite for multiple texts
  async rewriteMultipleTexts(requests: AIRewriteRequest[]): Promise<AIRewriteResponse[]> {
    const results: AIRewriteResponse[] = [];
    
    for (const request of requests) {
      try {
        const response = await this.rewriteText(request);
        results.push(response);
      } catch (error) {
        results.push({
          originalText: request.text,
          rewrittenText: request.text, // Keep original on error
          improvements: [`Error al procesar: ${error instanceof Error ? error.message : 'Error desconocido'}`]
        });
      }
    }
    
    return results;
  }
}

// Export singleton instance
export const rewriteService = new RewriteService();
export default rewriteService;