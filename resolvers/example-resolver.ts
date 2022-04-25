import { ObjectType, InterfaceType, Int, Field, Resolver, Query, Args, Mutation, Authorized, Arg, ID, InputType, ArgsType } from 'type-graphql'

@InterfaceType()
class Person {
  @Field(() => String, {
    description: 'A person name',
  })
  name!: string

  @Field(() => String, {
    description: 'A person age. Optional',
    nullable: true,
  })
  age?: number
}

@ObjectType({ implements: Person })
class Family extends Person {
  @Field(() => String, {
    description: 'Family relationship',
  })
  relationship!: string
}

@ObjectType({ implements: Person })
class Family2 implements Person {
  name!: string
  age?: number

  @Field(() => String, {
    description: 'Family relationship',
  })
  relationship!: string
}

@InputType()
class UpdatePersonData {
  @Field(() => String, {
    description: 'A person name',
  })
  name!: string

  @Field(() => String, {
    description: 'A person age. Optional',
    nullable: true,
  })
  age?: number

  @Field(() => String, {
    description: 'hi',
    deprecationReason: 'deprecationReason',
    nullable: true,
  })
  interest?: string
}

const john = new Person()
john.name = 'john'

const tina = new Family()
tina.name = 'tina'
tina.age = 44
tina.relationship = 'mon'

@Resolver()
class ExampleResolver {
  @Query(returns => Person, {
    description: 'A query to get a person',
  })
  async getPerson (
    @Arg('id') id: string
  ): Promise<Person> {
    console.log(id)

    return john
  }

  @Mutation(returns => Person, {
    description: 'Update a person with given payload',
  })
  async updatePerson (
    @Arg('person') updatePersonData: UpdatePersonData
  ): Promise<Person> {
    console.log(updatePersonData)

    return john
  }

  @Query(returns => Family)
  async getFamily (): Promise<Family> {
    return tina
  }

  @Query(returns => Family2)
  async getFamily2 (): Promise<Family2> {
    return tina
  }
}

export default ExampleResolver
