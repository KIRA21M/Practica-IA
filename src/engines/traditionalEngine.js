const RULES = [
  { category: 'SECURITY', terms: ['vulnerabilidad', 'phishing', 'malware', 'hack', 'brecha', 'expuesto', 'robo de datos', 'robo de credenciales', 'credenciales expuestas', 'credenciales comprometidas'] },
  { category: 'ACCESS', terms: ['iniciar sesión', 'iniciar sesion', 'contraseña', 'contrasena', 'login', 'acceso', 'bloqueada', 'bloqueado', 'autenticación', 'autenticacion'] },
  { category: 'BUG', terms: ['error', 'falla', 'fallo', 'bug', 'crash', 'no funciona', 'incorrecto', 'pantalla blanca'] },
  { category: 'FEATURE', terms: ['funcionalidad', 'característica', 'caracteristica', 'agregar', 'añadir', 'integración', 'integracion', 'solicito', 'permitir', 'sugerencia', 'modo oscuro'] }
];

const PRIORITY_TERMS = {
  CRITICAL: ['crítico', 'critico', 'urgente', 'caído', 'caido', 'brecha', 'robo de datos', 'producción detenida', 'token expuesto'],
  HIGH: ['no puedo', 'bloqueado', 'bloqueada', 'pérdida', 'perdida', 'seguridad', 'vulnerabilidad', 'phishing', 'malware'],
  MEDIUM: ['error', 'falla', 'problema', 'inconveniente'],
  LOW: ['sugerencia', 'mejorar', 'consulta', 'idea']
};

function normalize(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function analyzeTraditional(message) {
  const text = normalize(message);
  const scores = Object.fromEntries(RULES.map((rule) => [rule.category, rule.terms.filter((term) => text.includes(normalize(term))).length]));
  const category = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const selectedCategory = category[1] > 0 ? category[0] : 'BUG';

  const priority = Object.entries(PRIORITY_TERMS).find(([, terms]) => terms.some((term) => text.includes(normalize(term))))?.[0] || 'MEDIUM';
  const responses = {
    ACCESS: 'Verifique sus credenciales y utilice la recuperación de contraseña si es necesario.',
    BUG: 'Registramos el problema. Comparta los pasos para reproducirlo y cualquier mensaje de error visible.',
    FEATURE: 'Registramos la solicitud para que el equipo de producto evalúe su prioridad y viabilidad.',
    SECURITY: 'El caso requiere revisión humana. No comparta secretos adicionales y siga el protocolo de seguridad.'
  };

  return {
    category: selectedCategory,
    priority,
    response: responses[selectedCategory],
    requiresHumanReview: selectedCategory === 'SECURITY',
    mode: 'traditional'
  };
}
