export interface EventoAgape {
  titulo: string;
  tipo: 'formacao' | 'oracao' | 'feriado' | 'evento' | 'missa' | 'retiro' | 'vivencia' | 'dinamica' | 'solenidade' | 'festivo' | 'acao' | 'social' | 'reuniao' | 'liturgia';
}

export const eventos2026: Record<string, EventoAgape> = {
    // --- JANEIRO ---
    "18-1": { titulo: "Retorno do Ágape", tipo: "evento" },
    "25-1": { titulo: "Workshop 1", tipo: "formacao" },

    // --- FEVEREIRO ---
    "1-2": { titulo: "Workshop 2", tipo: "formacao" },
    "4-2": { titulo: "Intercessão pré-encontro", tipo: "oracao" },
    "8-2": { titulo: "Workshop 3", tipo: "formacao" },
    "10-2": { titulo: "Intercessão pré-encontro", tipo: "oracao" },
    "15-2": { titulo: "Carnaval", tipo: "feriado" },
    "21-2": { titulo: "Noite de tortas", tipo: "festivo" },
    "22-2": { titulo: "Workshop Dinâmica", tipo: "formacao" },
    "24-2": { titulo: "Intercessão pré-encontro", tipo: "oracao" },

    // --- MARÇO ---
    "1-3": { titulo: "Passagem do encontro", tipo: "reuniao" },
    "4-3": { titulo: "Missa de envio", tipo: "missa" },
    "7-3": { titulo: "Encontro Ágape", tipo: "retiro" },
    "8-3": { titulo: "Encontro Ágape", tipo: "retiro" },
    "15-3": { titulo: "Filho pródigo", tipo: "formacao" },
    "21-3": { titulo: "1ª vivência de cursistas", tipo: "vivencia" },
    "22-3": { titulo: "1ª formação de servos", tipo: "formacao" },
    "29-3": { titulo: "Relação com Deus (caça ao tesouro)", tipo: "dinamica" },

    // --- ABRIL ---
    "5-4": { titulo: "Páscoa", tipo: "solenidade" },
    "12-4": { titulo: "Oração e meditação", tipo: "oracao" },
    "19-4": { titulo: "Caridade", tipo: "acao" },
    "25-4": { titulo: "2ª vivência de cursistas", tipo: "vivencia" },
    "26-4": { titulo: "2ª formação de servos", tipo: "formacao" },
    "28-4": { titulo: "Intercessão", tipo: "oracao" },

    // --- MAIO ---
    "1-5": { titulo: "Deus Pai", tipo: "formacao" },
    "10-5": { titulo: "Dia das mães", tipo: "festivo" },
    "17-5": { titulo: "Deus Filho", tipo: "formacao" },
    "23-5": { titulo: "3ª vivência (Pentecostes)", tipo: "vivencia" },
    "24-5": { titulo: "3ª formação de servos", tipo: "formacao" },
    "26-5": { titulo: "Intercessão", tipo: "oracao" },
    "29-5": { titulo: "Festa Junina", tipo: "festivo" },
    "30-5": { titulo: "Festa Junina", tipo: "festivo" },
    "31-5": { titulo: "Festa Junina", tipo: "festivo" },

    // --- JUNHO ---
    "7-6": { titulo: "Deus Espírito Santo", tipo: "formacao" },
    "14-6": { titulo: "Maria", tipo: "formacao" },
    "21-6": { titulo: "Ser igreja", tipo: "formacao" },
    "27-6": { titulo: "4ª vivência de cursistas", tipo: "vivencia" },
    "28-6": { titulo: "4ª formação de servos", tipo: "formacao" },
    "30-6": { titulo: "Intercessão", tipo: "oracao" },

    // --- JULHO ---
    "5-7": { titulo: "O fim do homem", tipo: "formacao" },
    "12-7": { titulo: "Novíssimos", tipo: "formacao" },
    "18-7": { titulo: "Confra fim do semestre", tipo: "festivo" },
    "19-7": { titulo: "Férias", tipo: "feriado" },
    "26-7": { titulo: "Férias", tipo: "feriado" },

    // --- AGOSTO ---
    "1-8": { titulo: "Férias", tipo: "feriado" },
    "9-8": { titulo: "Dia dos pais", tipo: "festivo" },
    "15-8": { titulo: "Luau", tipo: "festivo" },
    "23-8": { titulo: "Viver em comunidade", tipo: "formacao" },
    "25-8": { titulo: "Intercessão", tipo: "oracao" },
    "29-8": { titulo: "5ª vivência de cursistas", tipo: "vivencia" },
    "30-8": { titulo: "5ª formação de servos", tipo: "formacao" },

    // --- SETEMBRO ---
    "6-9": { titulo: "Relacionamento com Deus", tipo: "formacao" },
    "10-9": { titulo: "Círio", tipo: "festivo" },
    "11-9": { titulo: "Círio", tipo: "festivo" },
    "12-9": { titulo: "Círio", tipo: "festivo" },
    "13-9": { titulo: "Círio", tipo: "festivo" },
    "20-9": { titulo: "Relacionamento consigo", tipo: "formacao" },
    "26-9": { titulo: "6ª vivência de cursistas", tipo: "vivencia" },
    "27-9": { titulo: "6ª formação de servos", tipo: "formacao" },
    "29-9": { titulo: "Intercessão", tipo: "oracao" },

    // --- OUTUBRO ---
    "4-10": { titulo: "Relacionamento familiar e c/ próximo", tipo: "formacao" },
    "11-10": { titulo: "Ação Social", tipo: "social" },
    "18-10": { titulo: "Castidade", tipo: "formacao" },
    "25-10": { titulo: "7ª vivência de cursistas", tipo: "vivencia" },
    "27-10": { titulo: "Intercessão", tipo: "oracao" },

    // --- NOVEMBRO ---
    "1-11": { titulo: "Vícios / Mídias Sociais", tipo: "formacao" },
    "7-11": { titulo: "Adoração ao Santíssimo", tipo: "oracao" },
    "8-11": { titulo: "Vocação", tipo: "formacao" },
    "15-11": { titulo: "Missa parte a parte", tipo: "liturgia" },
    "22-11": { titulo: "Querigma", tipo: "formacao" },
    "29-11": { titulo: "Retiro de servos", tipo: "retiro" },

    // --- DEZEMBRO ---
    "5-12": { titulo: "Confra fim de ano", tipo: "festivo" }
};