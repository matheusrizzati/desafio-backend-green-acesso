import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import {sequelize} from '../config/database';

export class Lote extends Model<InferAttributes<Lote>, InferCreationAttributes<Lote>> {
    declare id: CreationOptional<number>;
    declare nome: string;
    declare ativo: CreationOptional<boolean>;
    declare criado_em: CreationOptional<Date>;
    // declare updatedAt: CreationOptional<Date>;
}

Lote.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        nome: {
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
        },
        // updatedAt: {
        //     type: DataTypes.DATE,
        //     allowNull: false,
        //     defaultValue: DataTypes.NOW,
        // }
    },
    {
        tableName: 'lotes',
        sequelize,
        timestamps: false,
    }
)