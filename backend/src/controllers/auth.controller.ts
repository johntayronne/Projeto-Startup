import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma"; // Certifique-se de que você tem essa instância configurada
import dotenv from "dotenv";
import validator from 'validator';

dotenv.config();

console.log("🚀 JWT_SECRET:", process.env.JWT_SECRET);

export const register = async (req: Request, res: Response) => {
    try {
        console.log("📩 Recebendo requisição de registro:", req.body);

        const {
            name,
            email,
            password,
            phone,
            cpf,
            cnpj,
            cep,
            address,
            number,
            complement,
            neighborhood,
            city,
            state
        } = req.body;

        // Validação dos campos obrigatórios
        const requiredFields = [
            'name', 'email', 'password', 'phone', 'cpf',
            'cep', 'address', 'number', 'neighborhood', 'city', 'state'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            console.log("❌ Campos obrigatórios faltando:", missingFields);
            return res.status(400).json({
                error: `Campos obrigatórios faltando: ${missingFields.join(', ')}`
            });
        }

        if (!validator.isEmail(email)) {
            console.log("❌ Email inválido:", email);
            return res.status(400).json({ error: "Email inválido!" });
        }

        // Verificação de email existente
        console.log("🔍 Verificando email existente:", email);
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            console.log("❌ Email já cadastrado:", email);
            return res.status(400).json({ error: "Email já cadastrado!" });
        }

        // Verificação de CPF existente
        console.log("🔍 Verificando CPF existente:", cpf);
        const existingCPF = await prisma.user.findUnique({ where: { cpf } });
        if (existingCPF) {
            console.log("❌ CPF já cadastrado:", cpf);
            return res.status(400).json({ error: "CPF já cadastrado!" });
        }

        // Verificação de CNPJ existente (se fornecido)
        if (cnpj) {
            console.log("🔍 Verificando CNPJ existente:", cnpj);
            const existingCNPJ = await prisma.user.findUnique({ where: { cnpj } });
            if (existingCNPJ) {
                console.log("❌ CNPJ já cadastrado:", cnpj);
                return res.status(400).json({ error: "CNPJ já cadastrado!" });
            }
        }

        // Verificação de senha
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            console.log("❌ Senha não atende aos requisitos");
            return res.status(400).json({
                error: "A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um símbolo."
            });
        }

        console.log("🔒 Criptografando senha");
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("💾 Criando usuário no banco de dados");
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                cpf,
                cnpj,
                cep,
                address,
                number,
                complement,
                neighborhood,
                city,
                state
            },
        });

        console.log("✅ Usuário registrado com sucesso:", { id: user.id, email: user.email });

        res.status(201).json({
            message: "Usuário registrado com sucesso!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                cpf: user.cpf,
                cnpj: user.cnpj,
                address: user.address
            },
        });
    } catch (error) {
        console.error("🚨 Erro detalhado ao registrar usuário:", error);
        if (error instanceof Error) {
            console.error("Mensagem de erro:", error.message);
            console.error("Stack trace:", error.stack);
        }
        res.status(500).json({ 
            error: "Erro interno do servidor ao registrar usuário.",
            details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Erro desconhecido' : undefined
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: "Usuário não encontrado!" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: "Senha incorreta!" });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: "1h",
        });

        console.log("🔑 Token gerado:", token);

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error("🚨 Erro ao fazer login:", error);
        res.status(500).json({ error: "Erro ao fazer login." });
    }
};
