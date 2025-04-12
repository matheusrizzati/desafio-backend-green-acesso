import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Boleto extends Model<InferAttributes<Boleto>, InferCreationAttributes<Boleto>> {
    declare id: CreationOptional<number>;
    declare nome_sacado: string;
    declare id_lote: number;
    declare valor: number;
    declare linha_digitavel: string;
    declare ativo: CreationOptional<boolean>;
    declare criado_em: CreationOptional<Date>;
}

Boleto.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        nome_sacado: {
            type: new DataTypes.STRING,
            allowNull: false,
        },
        id_lote: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'lotes',
                key: 'id',
            }
        },
        valor: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        linha_digitavel: {
            type: new DataTypes.STRING(100),
            allowNull: false,
        },
        ativo: {
            type: new DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        criado_em: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        tableName: 'boletos',
        sequelize,
        timestamps: false,
    }
)