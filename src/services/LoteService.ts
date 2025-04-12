export class LoteService {
    buscarTodos() {
        // Simulando um banco de dados com um array estático
        const usuarios = [
            { id: 1, nome: 'João', email: 'joao@example.com' },
            { id: 2, nome: 'Maria', email: 'maria@example.com' },
            { id: 3, nome: 'Pedro', email: 'pedro@example.com' },
        ];

        return usuarios;
    }
}
