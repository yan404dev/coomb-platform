import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedCompleteUser() {
  try {
    // Delete existing test user if exists
    await prisma.user.deleteMany({
      where: { email: "teste@coomb.com" },
    });

    // Hash password
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Create user with all fields filled
    const user = await prisma.user.create({
      data: {
        email: "teste@coomb.com",
        password: hashedPassword,
        full_name: "João Pedro da Silva",
        phone: "+55 11 98765-4321",
        cpf: "123.456.789-00",
        birth_date: "1995-03-15",
        has_disability: false,
        race: "Pardo",
        sexual_orientation: "Heterossexual",
        gender: "Masculino",
        state: "São Paulo",
        city: "São Paulo",
        salary_expectation: "R$ 8.000,00",
        has_cnh: true,
        instagram: "https://instagram.com/joaopedro",
        facebook: "https://facebook.com/joaopedro.silva",
        linkedin: "https://linkedin.com/in/joaopedro-silva",
        portfolio: "https://joaopedro.dev",
        professional_summary:
          "Desenvolvedor Full Stack com 5 anos de experiência em desenvolvimento de aplicações web escaláveis. " +
          "Especializado em React, Node.js e arquitetura de microserviços. Apaixonado por criar soluções " +
          "inovadoras e trabalhar em equipe para entregar produtos de alta qualidade.",
        career_goals:
          "Busco uma posição de Tech Lead onde possa aplicar minha experiência técnica para liderar equipes " +
          "de desenvolvimento, arquitetar soluções robustas e mentorear desenvolvedores juniores. " +
          "Objetivo de longo prazo é me tornar CTO de uma startup de tecnologia.",
        plan_type: "premium",
        resume: {
          create: {
            experiences: [
              {
                position: "Tech Lead",
                company: "Tech Solutions Inc",
                startDate: "2022-01",
                endDate: null,
                current: true,
                description:
                  "Lidero equipe de 8 desenvolvedores no desenvolvimento de plataforma SaaS. " +
                  "Responsável por arquitetura, code review e mentoria técnica.",
              },
              {
                position: "Desenvolvedor Full Stack Senior",
                company: "StartupXYZ",
                startDate: "2020-03",
                endDate: "2021-12",
                current: false,
                description:
                  "Desenvolvimento de features críticas usando React, Node.js e PostgreSQL. " +
                  "Reduzi tempo de resposta da API em 40% através de otimizações.",
              },
              {
                position: "Desenvolvedor Full Stack",
                company: "Digital Agency",
                startDate: "2018-06",
                endDate: "2020-02",
                current: false,
                description:
                  "Desenvolvimento de aplicações web para clientes corporativos. " +
                  "Trabalho com React, Node.js, MongoDB e AWS.",
              },
            ],
            skills: [
              { name: "JavaScript", level: "Avançado" },
              { name: "TypeScript", level: "Avançado" },
              { name: "React", level: "Avançado" },
              { name: "Node.js", level: "Avançado" },
              { name: "NestJS", level: "Intermediário" },
              { name: "PostgreSQL", level: "Avançado" },
              { name: "MongoDB", level: "Intermediário" },
              { name: "Docker", level: "Intermediário" },
              { name: "AWS", level: "Intermediário" },
              { name: "Git", level: "Avançado" },
              { name: "Arquitetura de Software", level: "Avançado" },
              { name: "Liderança Técnica", level: "Intermediário" },
            ],
            languages: [
              { language: "Português", proficiency: "Nativo" },
              { language: "Inglês", proficiency: "Fluente" },
              { language: "Espanhol", proficiency: "Básico" },
            ],
            educations: [
              {
                degree: "Bacharelado",
                field: "Ciência da Computação",
                institution: "Universidade de São Paulo",
                startDate: "2014-02",
                endDate: "2017-12",
                current: false,
              },
              {
                degree: "MBA",
                field: "Gestão de Projetos",
                institution: "FGV",
                startDate: "2021-03",
                endDate: null,
                current: true,
              },
            ],
            certifications: [
              {
                name: "AWS Certified Solutions Architect",
                institution: "Amazon Web Services",
                completionDate: "2022-06",
              },
              {
                name: "Professional Scrum Master I",
                institution: "Scrum.org",
                completionDate: "2021-09",
              },
              {
                name: "React Advanced Patterns",
                institution: "Udemy",
                completionDate: "2020-11",
              },
            ],
          },
        },
      },
    });

    console.log("✅ Usuário criado com sucesso!");
    console.log("📧 Email:", user.email);
    console.log("🔑 Senha: 123456");
    console.log("👤 Nome:", user.full_name);
    console.log("🆔 User ID:", user.id);
    console.log("\n🎯 Próximos passos:");
    console.log("1. Faça login com teste@coomb.com / 123456");
    console.log("2. Acesse /perfil para ver os dados");
    console.log(
      "3. Clique em 'Gerar com IA' para testar o endpoint de personalidade"
    );
  } catch (error) {
    console.error("❌ Erro ao criar usuário:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCompleteUser();
