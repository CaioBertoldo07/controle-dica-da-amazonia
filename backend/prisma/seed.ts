/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ─── Admin user ───────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Admin@2024', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@dicadaamazonia.com.br' },
    update: {},
    create: {
      email: 'admin@dicadaamazonia.com.br',
      password: hashedPassword,
      name: 'Administrador',
      role: 'admin',
      isActive: true,
    },
  });
  console.log('✅ Usuário admin criado:', admin.email);

  // ─── Packagings ───────────────────────────────────────────────────────────
  const embalagemPadrao = await prisma.packaging.upsert({
    where: { name: 'Embalagem Padrão' },
    update: {},
    create: {
      name: 'Embalagem Padrão',
      type: 'PADRAO',
      description: 'Embalagem padrão utilizada pelos cafés de açaí, blend e milho.',
      unitCost: 2.5,
      currentStock: 0,
      minimumStock: 100,
    },
  });
  console.log('✅ Embalagem criada:', embalagemPadrao.name);

  const embalagemEspecial = await prisma.packaging.upsert({
    where: { name: 'Embalagem Especial Rende+' },
    update: {},
    create: {
      name: 'Embalagem Especial Rende+',
      type: 'ESPECIAL',
      description: 'Embalagem exclusiva do produto Rende+.',
      unitCost: 4.0,
      currentStock: 0,
      minimumStock: 100,
    },
  });
  console.log('✅ Embalagem criada:', embalagemEspecial.name);

  // ─── Products ─────────────────────────────────────────────────────────────
  const products = [
    {
      name: 'Café de Açaí',
      code: 'CAF-001',
      description: 'Café especial de açaí da Amazônia.',
      price: 25.0,
      packagingId: embalagemPadrao.id,
    },
    {
      name: 'Café de Açaí + Café Tradicional',
      code: 'CAF-002',
      description: 'Blend de café de açaí com café tradicional.',
      price: 28.0,
      packagingId: embalagemPadrao.id,
    },
    {
      name: 'Café de Milho',
      code: 'CAF-003',
      description: 'Café de milho da Amazônia.',
      price: 22.0,
      packagingId: embalagemPadrao.id,
    },
    {
      name: 'Rende+',
      code: 'REN-001',
      description: 'Produto Rende+ com embalagem especial.',
      price: 35.0,
      packagingId: embalagemEspecial.id,
    },
  ];

  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { code: product.code },
      update: {},
      create: product,
    });
    console.log('✅ Produto criado:', created.name, `(${created.code})`);
  }

  console.log('\n🎉 Seed concluído com sucesso!');
}

main()
  .catch((err) => {
    console.error('❌ Erro no seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
