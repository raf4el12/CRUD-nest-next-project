# 🏗️ Prompt para Implementar Arquitectura DDD con Clean Architecture en NestJS

## 📋 CONTEXTO Y OBJETIVO

Implementa un módulo backend siguiendo **Domain-Driven Design (DDD)** y **Clean Architecture** utilizando:
- **Framework**: NestJS (TypeScript)
- **ORM**: Prisma
- **Arquitectura**: 4 capas (Domain, Application, Infrastructure, Interfaces)
- **Patrones**: Repository, Use Cases, DTOs, Dependency Injection

---

## 🎯 ESTRUCTURA DE CARPETAS OBLIGATORIA

```
src/modules/[nombre-modulo]/
│
├── application/                          # CAPA DE APLICACIÓN
│   ├── dto/                             # Data Transfer Objects
│   │   ├── create-[entidad].dto.ts     # DTO para crear
│   │   ├── update-[entidad].dto.ts     # DTO para actualizar
│   │   ├── findOne-[entidad].dto.ts    # DTO para consultar uno
│   │   ├── findAll-[entidad].dto.ts    # DTO para listar
│   │   └── filter-[entidad].dto.ts     # DTO para filtros
│   │
│   ├── use-cases/                       # Casos de uso (Lógica de negocio)
│   │   ├── create-[entidad].use-case.ts
│   │   ├── update-[entidad].use-case.ts
│   │   ├── delete-[entidad].use-case.ts
│   │   ├── findOne-[entidad].use-case.ts
│   │   └── findAll-[entidad].use-case.ts
│   │
│   └── [modulo].module.ts               # Configuración del módulo NestJS
│
├── domain/                               # CAPA DE DOMINIO (Core)
│   ├── entities/                        # Entidades de dominio
│   │   └── [entidad].entity.ts
│   │
│   └── repositories/                    # Interfaces de repositorio (contratos)
│       └── [entidad].repository.ts
│
├── infraestructure/                     # CAPA DE INFRAESTRUCTURA
│   └── persistence/                     # Implementación de acceso a datos
│       └── prisma-[entidad].repository.ts
│
└── interfaces/                          # CAPA DE PRESENTACIÓN
    └── controllers/                     # Controladores HTTP
        └── [entidad].controller.ts
```

---

## 🏛️ CAPA 1: DOMAIN (Dominio)

### 📦 Entity (Entidad de Dominio)

**Ubicación**: `domain/entities/[entidad].entity.ts`

**Características**:
- ✅ Sin dependencias externas (TypeScript puro)
- ✅ Propiedades `readonly` (inmutabilidad)
- ✅ Representa el modelo de negocio central
- ✅ Tiene identidad única (ID)

**Plantilla**:
```typescript
export class [NombreEntidad] {
    constructor(
        readonly id: number,
        readonly campo1: string,
        readonly campo2: string | null,
        readonly campo3: boolean,
        readonly created_at: Date,
        readonly updated_at: Date | null,
        readonly status: boolean
    ) {}
}
```

**Ejemplo Real**:
```typescript
export class EntityClient {
    constructor(
        readonly id: number,
        readonly name: string | null,
        readonly description: string,
        readonly entity_type: string,
        readonly location: string | null,
        readonly email: string | null,
        readonly phone: string | null,
        readonly logo: string | null,
        readonly created_at: Date,
        readonly updated_at: Date | null,
        readonly status: boolean,
        readonly session_timeout_minutes: number | null = 60
    ) {}
}
```

---

### 🔌 Repository Interface (Contrato)

**Ubicación**: `domain/repositories/[entidad].repository.ts`

**Características**:
- ✅ Define el contrato de acceso a datos
- ✅ No tiene implementación (solo firma de métodos)
- ✅ Usa tipos del dominio (entities, value objects)

**Plantilla**:
```typescript
import { [NombreEntidad] } from '../entities/[entidad].entity';

export interface [NombreEntidad]Repository {
    create(data: Partial<[NombreEntidad]>): Promise<[NombreEntidad] | null>;
    findOne(data: Partial<[NombreEntidad]>): Promise<[NombreEntidad] | null>;
    findAll(userId: number, status: boolean): Promise<[NombreEntidad][] | null>;
    update(id: number, data: Partial<[NombreEntidad]>): Promise<[NombreEntidad] | null>;
    softDelete(id: number): Promise<{message: string; entity: [NombreEntidad] | null}>;
}
```

**Ejemplo Real**:
```typescript
export interface EntityClientRepository {
    create(entityClientData: Partial<EntityClient>): Promise<EntityClient | null>;
    findOne(entityClientData: Partial<EntityClient>): Promise<EntityClient | null>;
    update(id: number, entityClientData: Partial<EntityClient>): Promise<EntityClient | null>;
    findAll(user_id: number, status: boolean): Promise<EntityClient[] | null>;
    softDelete(id: number): Promise<{message: string; entity: EntityClient | null}>;
    isEntityClientInUse(id: number): Promise<{inUse: boolean; usedIn: string[]}>;
}
```

---

## ⚙️ CAPA 2: APPLICATION (Aplicación)

### 📝 DTOs (Data Transfer Objects)

**Ubicación**: `application/dto/`

**Características**:
- ✅ Validación con `class-validator`
- ✅ Documentación con Swagger (`@ApiProperty`)
- ✅ Transformación de tipos con `class-transformer`
- ✅ Separa el contrato de la API del dominio

**Plantilla para CREATE**:
```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class Create[NombreEntidad]Dto {
    @ApiProperty({ 
        example: 'Valor ejemplo', 
        description: 'Descripción del campo' 
    })
    @IsString()
    campo1: string;

    @ApiPropertyOptional({ 
        example: 'Valor opcional', 
        description: 'Campo opcional' 
    })
    @IsString()
    @IsOptional()
    campo2?: string;

    @ApiProperty({ 
        example: true, 
        description: 'Estado activo/inactivo' 
    })
    @IsBoolean()
    @IsOptional()
    status?: boolean;
}
```

**Plantilla para UPDATE**:
```typescript
import { PartialType } from '@nestjs/swagger';
import { Create[NombreEntidad]Dto } from './create-[entidad].dto';

export class Update[NombreEntidad]Dto extends PartialType(Create[NombreEntidad]Dto) {}
```

**Ejemplo Real**:
```typescript
export class CreateEntityClientDto {
    @ApiProperty({ example: 'Marina de Guerra del Perú', description: 'Nombre de la entidad' })
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 'Descripción', description: 'Descripción' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'publica', description: 'Tipo de entidad' })
    @IsString()
    @IsOptional()
    entity_type?: string;

    @ApiPropertyOptional({ example: 60, description: 'Session timeout in minutes' })
    @IsNumber()
    @IsOptional()
    session_timeout_minutes?: number;

    @ApiPropertyOptional({ type: [Number], example: [1, 2], description: 'Branch IDs' })
    @IsOptional()
    @IsArray()
    @Type(() => Number)
    @IsNumber({}, { each: true })
    branches?: number[];
}
```

---

### 🎬 Use Cases (Casos de Uso)

**Ubicación**: `application/use-cases/`

**Características**:
- ✅ Un caso de uso = una operación de negocio
- ✅ Orquesta repositorios y servicios
- ✅ Contiene lógica de aplicación (no lógica de dominio pura)
- ✅ Inyecta dependencias mediante tokens

**Plantilla para CREATE**:
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { [NombreEntidad]Repository } from '../../domain/repositories/[entidad].repository';
import { [NombreEntidad] } from '../../domain/entities/[entidad].entity';
import { Create[NombreEntidad]Dto } from '../dto/create-[entidad].dto';

@Injectable()
export class Create[NombreEntidad]UseCase {
    constructor(
        @Inject('[NombreEntidad]Repository')  // ← Token de inyección
        private readonly repository: [NombreEntidad]Repository,
    ) {}

    async execute(data: Create[NombreEntidad]Dto): Promise<[NombreEntidad] | null> {
        return await this.repository.create(data);
    }
}
```

**Plantilla para UPDATE**:
```typescript
@Injectable()
export class Update[NombreEntidad]UseCase {
    constructor(
        @Inject('[NombreEntidad]Repository')
        private readonly repository: [NombreEntidad]Repository,
    ) {}

    async execute(id: number, data: Update[NombreEntidad]Dto): Promise<[NombreEntidad] | null> {
        return await this.repository.update(id, data);
    }
}
```

**Plantilla para DELETE**:
```typescript
@Injectable()
export class Delete[NombreEntidad]UseCase {
    constructor(
        @Inject('[NombreEntidad]Repository')
        private readonly repository: [NombreEntidad]Repository,
    ) {}

    async execute(id: number): Promise<{message: string; entity: [NombreEntidad] | null}> {
        // Validación de reglas de negocio (ejemplo)
        const { inUse, usedIn } = await this.repository.is[NombreEntidad]InUse(id);
        
        if (inUse) {
            const usedInText = usedIn.join(' y ');
            throw new BadRequestException(
                `No se puede eliminar porque está siendo utilizado en ${usedInText}.`
            );
        }

        return await this.repository.softDelete(id);
    }
}
```

**Plantilla para FIND ONE**:
```typescript
@Injectable()
export class FindOne[NombreEntidad]UseCase {
    constructor(
        @Inject('[NombreEntidad]Repository')
        private readonly repository: [NombreEntidad]Repository,
    ) {}

    async execute(data: Partial<[NombreEntidad]>): Promise<[NombreEntidad] | null> {
        return await this.repository.findOne(data);
    }
}
```

**Plantilla para FIND ALL**:
```typescript
@Injectable()
export class FindAll[NombreEntidad]UseCase {
    constructor(
        @Inject('[NombreEntidad]Repository')
        private readonly repository: [NombreEntidad]Repository,
    ) {}

    async execute(userId: number, status: boolean): Promise<[NombreEntidad][] | null> {
        return await this.repository.findAll(userId, status);
    }
}
```

---

### 🔧 Module Configuration

**Ubicación**: `application/[modulo].module.ts`

**Características**:
- ✅ Registra todos los use cases
- ✅ Vincula la interfaz del repositorio con su implementación
- ✅ Usa token-based dependency injection
- ✅ Exporta use cases si otros módulos los necesitan

**Plantilla**:
```typescript
import { Module } from '@nestjs/common';
import { [NombreEntidad]Controller } from '../interfaces/controllers/[entidad].controller';
import { Create[NombreEntidad]UseCase } from './use-cases/create-[entidad].use-case';
import { Update[NombreEntidad]UseCase } from './use-cases/update-[entidad].use-case';
import { Delete[NombreEntidad]UseCase } from './use-cases/delete-[entidad].use-case';
import { FindOne[NombreEntidad]UseCase } from './use-cases/findOne-[entidad].use-case';
import { FindAll[NombreEntidad]UseCase } from './use-cases/findAll-[entidad].use-case';
import { Prisma[NombreEntidad]Repository } from '../infraestructure/persistence/prisma-[entidad].repository';

@Module({
    controllers: [[NombreEntidad]Controller],
    providers: [
        // Casos de uso
        Create[NombreEntidad]UseCase,
        Update[NombreEntidad]UseCase,
        Delete[NombreEntidad]UseCase,
        FindOne[NombreEntidad]UseCase,
        FindAll[NombreEntidad]UseCase,
        
        // Repositorio (Dependency Injection Token)
        {
            provide: '[NombreEntidad]Repository',      // ← Token (abstracción)
            useClass: Prisma[NombreEntidad]Repository  // ← Implementación concreta
        },
    ],
    exports: [Create[NombreEntidad]UseCase], // Opcional: si otros módulos lo necesitan
})
export class [NombreModulo]Module {}
```

**Ejemplo Real**:
```typescript
@Module({
    controllers: [EntitiesClientController],
    providers: [
        CreateEntityClientUseCase,
        UpdateEntityClientUseCase,
        FindOneEntityClientUseCase,
        FindAllEntityClientByBranchesUseCase,
        DeleteEntityClientUseCase,
        FindAllEntityClientPaginationUseCase,
        FindAllEntitiesBranchesUseCase,
        {
            provide: 'EntityClientRepository',
            useClass: PrismaEntityClientRepository
        },
    ],
    exports: [CreateEntityClientUseCase],
})
export class EntitiesClientModule {}
```

---

## 🗄️ CAPA 3: INFRASTRUCTURE (Infraestructura)

### 🔩 Repository Implementation (Prisma)

**Ubicación**: `infraestructure/persistence/prisma-[entidad].repository.ts`

**Características**:
- ✅ Implementa la interfaz del repositorio
- ✅ Única clase que interactúa con Prisma
- ✅ Mapea modelos de Prisma a entidades de dominio
- ✅ Contiene toda la lógica de acceso a datos

**Plantilla**:
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { [NombreEntidad]Repository } from '../../domain/repositories/[entidad].repository';
import { [NombreEntidad] } from '../../domain/entities/[entidad].entity';

@Injectable()
export class Prisma[NombreEntidad]Repository implements [NombreEntidad]Repository {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async create(data: Partial<[NombreEntidad]>): Promise<[NombreEntidad]> {
        const created = await this.prisma.[tabla_prisma].create({
            data: {
                campo1: data.campo1,
                campo2: data.campo2,
                status: true,
            },
        });

        // Mapeo: Prisma model → Domain entity
        return new [NombreEntidad](
            created.id,
            created.campo1,
            created.campo2,
            created.created_at,
            created.updated_at,
            created.status
        );
    }

    async findOne(data: Partial<[NombreEntidad]>): Promise<[NombreEntidad] | null> {
        const found = await this.prisma.[tabla_prisma].findFirst({
            where: { ...data },
        });

        if (!found) return null;

        return new [NombreEntidad](
            found.id,
            found.campo1,
            found.campo2,
            found.created_at,
            found.updated_at,
            found.status
        );
    }

    async findAll(userId: number, status: boolean): Promise<[NombreEntidad][] | null> {
        const items = await this.prisma.[tabla_prisma].findMany({
            where: { 
                user_id: userId,
                status 
            },
            orderBy: { created_at: 'desc' }
        });

        return items.map(item => new [NombreEntidad](
            item.id,
            item.campo1,
            item.campo2,
            item.created_at,
            item.updated_at,
            item.status
        ));
    }

    async update(id: number, data: Partial<[NombreEntidad]>): Promise<[NombreEntidad] | null> {
        const updated = await this.prisma.[tabla_prisma].update({
            where: { id },
            data: {
                campo1: data.campo1,
                campo2: data.campo2,
            },
        });

        return new [NombreEntidad](
            updated.id,
            updated.campo1,
            updated.campo2,
            updated.created_at,
            updated.updated_at,
            updated.status
        );
    }

    async softDelete(id: number): Promise<{message: string; entity: [NombreEntidad] | null}> {
        const deleted = await this.prisma.[tabla_prisma].update({
            where: { id },
            data: { status: false }
        });

        return {
            message: 'Entity successfully inactivated (soft deleted)',
            entity: new [NombreEntidad](
                deleted.id,
                deleted.campo1,
                deleted.campo2,
                deleted.created_at,
                deleted.updated_at,
                deleted.status
            ),
        };
    }

    // Método auxiliar para validaciones de negocio
    async is[NombreEntidad]InUse(id: number): Promise<{inUse: boolean; usedIn: string[]}> {
        const usedIn: string[] = [];

        // Ejemplo: verificar en tablas relacionadas
        const relatedCount = await this.prisma.[tabla_relacionada].count({
            where: { [entidad]_id: id }
        });

        if (relatedCount > 0) {
            usedIn.push('registros relacionados');
        }

        return {
            inUse: usedIn.length > 0,
            usedIn
        };
    }
}
```

**Ejemplo Real**:
```typescript
@Injectable()
export class PrismaEntityClientRepository implements EntityClientRepository {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async create(entities: Partial<EntityClient>): Promise<EntityClient> {
        const createEntityClient = await this.prisma.entities_client.create({
            data: {
                name: entities.name,
                description: entities.description,
                entity_type: entities.entity_type,
                location: entities.location,
                email: entities.email,
                phone: entities.phone,
                logo: entities.logo,
                status: true,
                session_timeout_minutes: entities.session_timeout_minutes || 60
            },
        });

        return new EntityClient(
            createEntityClient.id,
            createEntityClient.name,
            createEntityClient.description,
            createEntityClient.entity_type,
            createEntityClient.location,
            createEntityClient.email,
            createEntityClient.phone,
            createEntityClient.logo,
            createEntityClient.created_at,
            createEntityClient.updated_at,
            createEntityClient.status,
            createEntityClient.session_timeout_minutes
        );
    }

    async softDelete(id: number): Promise<{ message: string; entity: EntityClient | null }> {
        const entity = await this.prisma.entities_client.update({
            where: { id },
            data: { status: false }
        });

        return {
            message: 'Entity successfully inactivated (soft deleted)',
            entity: new EntityClient(
                entity.id, entity.name, entity.description, entity.entity_type,
                entity.location, entity.email, entity.phone, entity.logo,
                entity.created_at, entity.updated_at, entity.status,
                entity.session_timeout_minutes
            ),
        };
    }
}
```

---

## 🌐 CAPA 4: INTERFACES (Presentación)

### 🎛️ Controller (Controlador HTTP)

**Ubicación**: `interfaces/controllers/[entidad].controller.ts`

**Características**:
- ✅ Thin controller (sin lógica de negocio)
- ✅ Solo orquesta use cases
- ✅ Validación de entrada (DTOs, ParseIntPipe)
- ✅ Decoradores de autorización si aplica
- ✅ Documentación Swagger

**Plantilla**:
```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Create[NombreEntidad]UseCase } from '../../application/use-cases/create-[entidad].use-case';
import { Update[NombreEntidad]UseCase } from '../../application/use-cases/update-[entidad].use-case';
import { Delete[NombreEntidad]UseCase } from '../../application/use-cases/delete-[entidad].use-case';
import { FindOne[NombreEntidad]UseCase } from '../../application/use-cases/findOne-[entidad].use-case';
import { FindAll[NombreEntidad]UseCase } from '../../application/use-cases/findAll-[entidad].use-case';
import { Create[NombreEntidad]Dto } from '../../application/dto/create-[entidad].dto';
import { Update[NombreEntidad]Dto } from '../../application/dto/update-[entidad].dto';

@ApiTags('[nombre-modulo]')
@Controller('[nombre-modulo]')
export class [NombreEntidad]Controller {
    constructor(
        private readonly createUseCase: Create[NombreEntidad]UseCase,
        private readonly updateUseCase: Update[NombreEntidad]UseCase,
        private readonly deleteUseCase: Delete[NombreEntidad]UseCase,
        private readonly findOneUseCase: FindOne[NombreEntidad]UseCase,
        private readonly findAllUseCase: FindAll[NombreEntidad]UseCase,
    ) {}

    @Post()
    async create(@Body() body: Create[NombreEntidad]Dto) {
        return await this.createUseCase.execute(body);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.findOneUseCase.execute({ id });
    }

    @Get()
    async findAll() {
        // Ajusta según tu lógica (ej: userId del JWT)
        return await this.findAllUseCase.execute(1, true);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Update[NombreEntidad]Dto
    ) {
        return await this.updateUseCase.execute(id, body);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.deleteUseCase.execute(id);
    }
}
```

**Ejemplo Real con Permisos**:
```typescript
@ApiTags('entities-client')
@Controller('entities-client')
export class EntitiesClientController {
    constructor(
        private readonly createEntityClientUseCase: CreateEntityClientUseCase,
        private readonly updateEntityClientUseCase: UpdateEntityClientUseCase,
        private readonly deleteEntityClientUseCase: DeleteEntityClientUseCase,
    ) {}

    @RequirePermissions('crear')  // ← Decorador de autorización
    @Post('add')
    async addEntityClient(@Body() body: CreateEntityClientDto) {
        return await this.createEntityClientUseCase.execute(body);
    }

    @RequirePermissions('editar')
    @Put('update/:id')
    async updateEntityClient(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateEntityClientDto
    ) {
        return await this.updateEntityClientUseCase.execute(id, updateDto);
    }

    @RequirePermissions('eliminar')
    @Delete('entity/:id')
    async deleteEntityClient(@Param('id', ParseIntPipe) id: number) {
        return await this.deleteEntityClientUseCase.execute(id);
    }
}
```

---

## 📐 CONVENCIONES DE NOMBRADO

### Archivos (kebab-case)
```
✅ entities-client.entity.ts
✅ create-entities-client.dto.ts
✅ create-entities-client.use-case.ts
✅ entities-client.repository.ts
✅ prisma-entities-client.repository.ts
✅ entities-client.controller.ts
✅ entities-client.module.ts
```

### Clases (PascalCase)
```typescript
✅ EntityClient                         // Entity
✅ EntityClientRepository               // Repository interface
✅ PrismaEntityClientRepository         // Repository implementation
✅ CreateEntityClientDto                // DTO
✅ CreateEntityClientUseCase            // Use case
✅ EntitiesClientController             // Controller
✅ EntitiesClientModule                 // Module
```

### Tokens de Inyección de Dependencias
```typescript
// Token (string literal)
provide: 'EntityClientRepository'       // ← Coincide con el nombre de la interfaz

// En el use case
@Inject('EntityClientRepository')       // ← Mismo token
private readonly repository: EntityClientRepository
```

---

## 🔄 FLUJO DE DEPENDENCIAS

```
┌─────────────────────────────────────────────────────────────┐
│                       CONTROLLER                             │
│  (interfaces/controllers/[entidad].controller.ts)           │
│  - Thin Controller                                           │
│  - No business logic                                         │
└─────────────────────┬───────────────────────────────────────┘
                      │ depends on
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      USE CASES                               │
│  (application/use-cases/*.use-case.ts)                      │
│  - Orchestrates business operations                          │
│  - Coordinates repositories                                  │
└─────────────────────┬───────────────────────────────────────┘
                      │ depends on
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              REPOSITORY INTERFACE (Contract)                 │
│  (domain/repositories/[entidad].repository.ts)              │
│  - Defines data access contract                              │
│  - NO implementation                                         │
└─────────────────────△───────────────────────────────────────┘
                      │ implemented by
                      │
┌─────────────────────┴───────────────────────────────────────┐
│         PRISMA REPOSITORY (Implementation)                   │
│  (infraestructure/persistence/prisma-[entidad].repository)  │
│  - Implements repository interface                           │
│  - Interacts with Prisma                                     │
│  - Maps Prisma models → Domain entities                      │
└─────────────────────────────────────────────────────────────┘
```

**Regla de oro**: Las capas internas NO conocen las capas externas
- ✅ Domain → No conoce a nadie (TypeScript puro)
- ✅ Application → Conoce a Domain (usa entities y repository interfaces)
- ✅ Infrastructure → Conoce a Domain (implementa interfaces)
- ✅ Interfaces → Conoce a Application (usa use cases y DTOs)

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Paso 1: Domain Layer
- [ ] Crear entidad en `domain/entities/[entidad].entity.ts`
  - [ ] Constructor con propiedades `readonly`
  - [ ] Incluir: id, created_at, updated_at, status
  - [ ] Sin dependencias externas
- [ ] Crear repository interface en `domain/repositories/[entidad].repository.ts`
  - [ ] Definir métodos CRUD básicos
  - [ ] Usar tipos del dominio (entidades)
  - [ ] Sin implementación

### Paso 2: Application Layer - DTOs
- [ ] Crear `create-[entidad].dto.ts`
  - [ ] Decoradores de validación (`@IsString`, `@IsOptional`, etc.)
  - [ ] Documentación Swagger (`@ApiProperty`)
- [ ] Crear `update-[entidad].dto.ts`
  - [ ] Extender de `PartialType(Create[NombreEntidad]Dto)`
- [ ] Crear DTOs adicionales según necesidad (filter, pagination, etc.)

### Paso 3: Application Layer - Use Cases
- [ ] Crear `create-[entidad].use-case.ts`
  - [ ] `@Injectable()` decorator
  - [ ] Inyectar repositorio con `@Inject('[NombreEntidad]Repository')`
  - [ ] Método `execute()` que llama a `repository.create()`
- [ ] Crear `update-[entidad].use-case.ts`
- [ ] Crear `delete-[entidad].use-case.ts`
  - [ ] Incluir validaciones de negocio si aplica
- [ ] Crear `findOne-[entidad].use-case.ts`
- [ ] Crear `findAll-[entidad].use-case.ts`

### Paso 4: Infrastructure Layer
- [ ] Crear `prisma-[entidad].repository.ts` en `infraestructure/persistence/`
  - [ ] `@Injectable()` decorator
  - [ ] `implements [NombreEntidad]Repository`
  - [ ] Inyectar `PrismaService` en constructor
  - [ ] Implementar todos los métodos de la interfaz
  - [ ] Mapear cada resultado de Prisma a entidad de dominio (`new [NombreEntidad](...)`)
  - [ ] Implementar soft delete (status = false)

### Paso 5: Interfaces Layer
- [ ] Crear `[entidad].controller.ts` en `interfaces/controllers/`
  - [ ] `@Controller('[nombre-modulo]')` decorator
  - [ ] `@ApiTags('[nombre-modulo]')` para Swagger
  - [ ] Inyectar todos los use cases en constructor
  - [ ] Crear endpoints REST:
    - [ ] `@Post()` → create
    - [ ] `@Get(':id')` → findOne
    - [ ] `@Get()` → findAll
    - [ ] `@Put(':id')` → update
    - [ ] `@Delete(':id')` → delete
  - [ ] Usar `@Body()` para DTOs
  - [ ] Usar `@Param('id', ParseIntPipe)` para IDs
  - [ ] Agregar decoradores de autorización si aplica (`@RequirePermissions()`)

### Paso 6: Module Configuration
- [ ] Crear `[modulo].module.ts` en `application/`
  - [ ] `@Module()` decorator
  - [ ] Registrar controller en `controllers: []`
  - [ ] Registrar todos los use cases en `providers: []`
  - [ ] Configurar token de inyección:
    ```typescript
    {
      provide: '[NombreEntidad]Repository',
      useClass: Prisma[NombreEntidad]Repository
    }
    ```
  - [ ] Exportar use cases si otros módulos los necesitan

### Paso 7: Integración
- [ ] Importar el módulo en `app.module.ts`
- [ ] Verificar que Prisma schema está actualizado
- [ ] Ejecutar migraciones si es necesario
- [ ] Probar endpoints en Swagger/Postman

---

## 🎯 PRINCIPIOS SOLID APLICADOS

1. **Single Responsibility Principle (SRP)**
   - ✅ Cada use case = una operación
   - ✅ Controller solo maneja HTTP
   - ✅ Repository solo maneja datos

2. **Open/Closed Principle (OCP)**
   - ✅ Fácil agregar nuevos use cases sin modificar existentes
   - ✅ Fácil cambiar implementación de repositorio (Prisma → TypeORM)

3. **Liskov Substitution Principle (LSP)**
   - ✅ Cualquier implementación de repositorio es intercambiable

4. **Interface Segregation Principle (ISP)**
   - ✅ Repository interface solo tiene métodos necesarios

5. **Dependency Inversion Principle (DIP)**
   - ✅ Use cases dependen de abstracciones (repository interface)
   - ✅ No dependen de implementaciones concretas (Prisma)

---

## 🚫 ANTI-PATRONES A EVITAR

❌ **NO** inyectar `PrismaService` directamente en use cases
```typescript
// ❌ MAL
constructor(private readonly prisma: PrismaService) {}
```

✅ **SÍ** usar la interfaz del repositorio
```typescript
// ✅ BIEN
constructor(
  @Inject('[NombreEntidad]Repository')
  private readonly repository: [NombreEntidad]Repository
) {}
```

---

❌ **NO** poner lógica de negocio en el controller
```typescript
// ❌ MAL
@Post()
async create(@Body() body: CreateDto) {
  const entity = await this.prisma.tabla.create({ data: body });
  if (body.relatedIds) {
    await this.prisma.related.createMany(...);
  }
  return entity;
}
```

✅ **SÍ** delegar al use case
```typescript
// ✅ BIEN
@Post()
async create(@Body() body: CreateDto) {
  return await this.createUseCase.execute(body);
}
```

---

❌ **NO** retornar modelos de Prisma directamente
```typescript
// ❌ MAL
async create(data): Promise<any> {
  return await this.prisma.tabla.create({ data });
}
```

✅ **SÍ** mapear a entidad de dominio
```typescript
// ✅ BIEN
async create(data): Promise<[NombreEntidad]> {
  const created = await this.prisma.tabla.create({ data });
  return new [NombreEntidad](
    created.id,
    created.campo1,
    created.campo2,
    created.created_at,
    created.updated_at,
    created.status
  );
}
```

---

❌ **NO** usar `any` como tipo de retorno
```typescript
// ❌ MAL
async findAll(): Promise<any> { ... }
```

✅ **SÍ** tipar correctamente
```typescript
// ✅ BIEN
async findAll(): Promise<[NombreEntidad][]> { ... }
```

---

## 📚 PATRONES DDD IMPLEMENTADOS

| Patrón | Ubicación | Descripción |
|--------|-----------|-------------|
| **Entity** | `domain/entities/` | Objetos con identidad única (ID) |
| **Value Object** | `shared/value-objects/` | Objetos inmutables sin identidad |
| **Repository** | `domain/repositories/` | Abstracción del acceso a datos |
| **Use Case / Application Service** | `application/use-cases/` | Orquestación de lógica de negocio |
| **DTO** | `application/dto/` | Objetos de transferencia de datos |
| **Dependency Injection** | Todo el sistema | Inversión de control |
| **Bounded Context** | Módulo completo | Límites del contexto de negocio |
| **Soft Delete** | Repository | Inactivación lógica (status = false) |

---

## 🔍 EJEMPLO COMPLETO: Módulo "Products"

### Estructura
```
src/modules/products/
├── application/
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   └── update-product.dto.ts
│   ├── use-cases/
│   │   ├── create-product.use-case.ts
│   │   ├── update-product.use-case.ts
│   │   ├── delete-product.use-case.ts
│   │   ├── findOne-product.use-case.ts
│   │   └── findAll-product.use-case.ts
│   └── products.module.ts
├── domain/
│   ├── entities/
│   │   └── product.entity.ts
│   └── repositories/
│       └── product.repository.ts
├── infraestructure/
│   └── persistence/
│       └── prisma-product.repository.ts
└── interfaces/
    └── controllers/
        └── product.controller.ts
```

### Entity
```typescript
// domain/entities/product.entity.ts
export class Product {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly description: string,
        readonly price: number,
        readonly stock: number,
        readonly category_id: number,
        readonly created_at: Date,
        readonly updated_at: Date | null,
        readonly status: boolean
    ) {}
}
```

### Repository Interface
```typescript
// domain/repositories/product.repository.ts
export interface ProductRepository {
    create(data: Partial<Product>): Promise<Product | null>;
    findOne(data: Partial<Product>): Promise<Product | null>;
    findAll(categoryId: number, status: boolean): Promise<Product[] | null>;
    update(id: number, data: Partial<Product>): Promise<Product | null>;
    softDelete(id: number): Promise<{message: string; entity: Product | null}>;
}
```

### DTO
```typescript
// application/dto/create-product.dto.ts
export class CreateProductDto {
    @ApiProperty({ example: 'iPhone 15', description: 'Product name' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 'Latest model', description: 'Description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 999.99, description: 'Price' })
    @IsNumber()
    price: number;

    @ApiProperty({ example: 100, description: 'Stock quantity' })
    @IsNumber()
    stock: number;

    @ApiProperty({ example: 1, description: 'Category ID' })
    @IsNumber()
    category_id: number;
}
```

### Use Case
```typescript
// application/use-cases/create-product.use-case.ts
@Injectable()
export class CreateProductUseCase {
    constructor(
        @Inject('ProductRepository')
        private readonly repository: ProductRepository,
    ) {}

    async execute(data: CreateProductDto): Promise<Product | null> {
        return await this.repository.create(data);
    }
}
```

### Repository Implementation
```typescript
// infraestructure/persistence/prisma-product.repository.ts
@Injectable()
export class PrismaProductRepository implements ProductRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Partial<Product>): Promise<Product> {
        const created = await this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
                category_id: data.category_id,
                status: true,
            },
        });

        return new Product(
            created.id,
            created.name,
            created.description,
            created.price,
            created.stock,
            created.category_id,
            created.created_at,
            created.updated_at,
            created.status
        );
    }

    async softDelete(id: number): Promise<{message: string; entity: Product | null}> {
        const deleted = await this.prisma.product.update({
            where: { id },
            data: { status: false }
        });

        return {
            message: 'Product successfully inactivated',
            entity: new Product(
                deleted.id, deleted.name, deleted.description, deleted.price,
                deleted.stock, deleted.category_id, deleted.created_at,
                deleted.updated_at, deleted.status
            ),
        };
    }
}
```

### Controller
```typescript
// interfaces/controllers/product.controller.ts
@ApiTags('products')
@Controller('products')
export class ProductController {
    constructor(
        private readonly createUseCase: CreateProductUseCase,
        private readonly updateUseCase: UpdateProductUseCase,
        private readonly deleteUseCase: DeleteProductUseCase,
        private readonly findOneUseCase: FindOneProductUseCase,
        private readonly findAllUseCase: FindAllProductUseCase,
    ) {}

    @Post()
    async create(@Body() body: CreateProductDto) {
        return await this.createUseCase.execute(body);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.findOneUseCase.execute({ id });
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateProductDto
    ) {
        return await this.updateUseCase.execute(id, body);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.deleteUseCase.execute(id);
    }
}
```

### Module
```typescript
// application/products.module.ts
@Module({
    controllers: [ProductController],
    providers: [
        CreateProductUseCase,
        UpdateProductUseCase,
        DeleteProductUseCase,
        FindOneProductUseCase,
        FindAllProductUseCase,
        {
            provide: 'ProductRepository',
            useClass: PrismaProductRepository
        },
    ],
})
export class ProductsModule {}
```

---

## 🎓 RESUMEN EJECUTIVO

**Implementa cada módulo siguiendo esta arquitectura:**

1. **Domain Layer**: Define entidades y contratos (interfaces)
2. **Application Layer**: Crea DTOs y use cases
3. **Infrastructure Layer**: Implementa repositorios con Prisma
4. **Interfaces Layer**: Crea controllers REST

**Reglas clave:**
- ✅ Domain no conoce a nadie
- ✅ Use cases inyectan repositorios por token
- ✅ Controllers solo llaman use cases
- ✅ Repository mapea Prisma → Domain entity
- ✅ DTOs validan entrada
- ✅ Soft delete con status = false

**Beneficios:**
- 🧪 Testeable (mock repositories fácilmente)
- 🔄 Mantenible (clara separación de capas)
- 📈 Escalable (agregar features sin romper código)
- 🔧 Flexible (cambiar DB sin afectar lógica de negocio)

---

**¡Sigue esta guía paso a paso y tendrás un módulo limpio, profesional y mantenible!** 🚀
