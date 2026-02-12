import { prisma } from './prisma';

async function seedDepartments() {
  await prisma.department.createMany({
    data: [{ name: 'IT' }, { name: 'Finance' }, { name: 'Human Resource' }],
    skipDuplicates: true,
  });

  console.log('Departments seeded successfully');
}

seedDepartments()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
