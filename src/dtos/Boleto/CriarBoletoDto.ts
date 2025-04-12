export interface CriarBoletoDto {
    nome_sacado: string;
    id_lote: number;
    valor: number;
    linha_digitavel: string;
    status?: string;
}