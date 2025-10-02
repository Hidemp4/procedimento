import { createClient } from '@/utils/supabase/server';

export default async function getColaboradores() {
    
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('colaboradores')
        .select('*')
        
    if (error) {
        console.error('Erro ao buscar colaboradores: ', error); 
        return [];
    }

    return data;
}