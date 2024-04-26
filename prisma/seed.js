const { PrismaClient } =  require("@prisma/client")

async function seed(){
    const db = new PrismaClient()
    // await db.student.create({
    //     data: {
    //         email: 'test@example.com',
    //         gaurdianEmail: 'test@example.com',
    //         gaurdianMobile: '+91999',
    //         gaurdianName: 'test',
    //         gaurdianRelation: 'test',
    //         mobile: '+91999',
    //         name: 'test',
    //         password: 'test',
    //         profilePhotoId: 'test',
    //         roles: 'test',
    //         rollNumber: 'test'
    //     }
    // })

    // await db.mess_Bill.create({
    //     data: {
    //         rollNumber: "test",
    //         month: 5,
    //         year: 2023,
    //         amount: 4000,
    //         balance: 4000,
    //         studentId: "test"
    //     }
    // })

    const data = await db.student.findFirst({
        where: {
            rollNumber: {
                equals: "test",
            }
        },
        select: {
            Document: true
        }
    })

    console.log(data)
}

seed()