# 📄 Patrón de Paginación en Arquitectura DDD

## 🎯 OBJETIVO

Implementar paginación consistente en módulos siguiendo Domain-Driven Design (DDD) con:
- **DTO de paginación** para validar parámetros de entrada
- **Value Object de paginación** para lógica de dominio
- **Helpers de paginación** para cálculos (offset, limit, metadata)

---

## 📐 COMPONENTES DEL PATRÓN

### 1️⃣ PaginationDto (Entrada HTTP - Application Layer)
**Ubicación**: `application/dto/pagination-[modulo].dto.ts`

### 2️⃣ Pagination Value Object (Domain Layer)
**Ubicación**: `shared/utils/value-objects/pagination.value-object.ts`

### 3️⃣ Helpers de Paginación
**Ubicación**: `shared/utils/pagination.ts`

---

## 🔧 IMPLEMENTACIÓN PASO A PASO

### PASO 1: Crear DTO de Paginación Específico del Módulo

**Ubicación**: `application/dto/pagination-[modulo].dto.ts`

**Características**:
- ✅ Extiende o replica estructura base de `PaginationDto`
- ✅ Valida parámetros con `class-validator`
- ✅ Documenta con Swagger
- ✅ Puede agregar campos específicos del módulo

**Plantilla**:
```typescript
import { IsInt, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class Pagination[NombreModulo]Dto {
  @ApiPropertyOptional({
    example: 'búsqueda',
    description: 'Texto a buscar en [módulo] (por nombre, descripción, etc.)',
  })
  @IsOptional()
  @IsString()
  searchValue?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Número de la página actual para la paginación',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  currentPage?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Cantidad de resultados por página',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageSize?: number;

  @ApiPropertyOptional({
    example: 'name',
    description: 'Campo por el cual se quiere ordenar la búsqueda',
  })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Modo de ordenamiento (asc o desc)',
  })
  @IsOptional()
  @IsString()
  orderByMode?: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'Valor numérico opcional para filtros personalizados',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  custom_value?: number;

  // 🔥 Agrega campos adicionales específicos de tu módulo si es necesario
  // Por ejemplo: category_id, status_filter, date_from, date_to, etc.
}
```

**Ejemplo Real (entities_client)**:
```typescript
export class PaginationEntityClientDto {
  @ApiPropertyOptional({
    example: 'Privada',
    description: 'Texto a buscar en las entidades (por nombre, descripción, etc.)',
  })
  @IsOptional()
  @IsString()
  searchValue?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Número de la página actual para la paginación',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  currentPage?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Cantidad de resultados por página',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageSize?: number;

  @ApiPropertyOptional({
    example: 'name',
    description: 'Campo por el cual se quiere ordenar la búsqueda',
  })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Modo de ordenamiento (ASC o DESC)',
  })
  @IsOptional()
  @IsString()
  orderByMode?: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'ID de la sucursal para filtrar',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  custom_value?: number;
}
```

---

### PASO 2: Usar Value Object en el Dominio

**El Value Object ya existe en**: `shared/utils/value-objects/pagination.value-object.ts`

```typescript
export class Pagination {
    constructor(
        public readonly searchValue?: string,
        public readonly currentPage: number = 1,
        public readonly pageSize: number = 10,
        public readonly orderBy?: string,
        public readonly orderByMode?: string,
        public readonly custom_value?: number,
        public readonly role_id?: number
    ) { }
}
```

**Características del Value Object**:
- ✅ Inmutable (propiedades `readonly`)
- ✅ Sin dependencias externas
- ✅ Valores por defecto (currentPage = 1, pageSize = 10)
- ✅ Ubicado en `shared/` (Shared Kernel)

---

### PASO 3: Crear Use Case de Paginación

**Ubicación**: `application/use-cases/findAll-[modulo]-pagination.use-case.ts`

**Responsabilidad**:
- ✅ Recibir DTO de paginación desde el controller
- ✅ Convertir DTO → Value Object
- ✅ Llamar al repositorio con el Value Object
- ✅ Retornar resultados paginados

**Plantilla**:
```typescript
import { Injectable, Inject } from "@nestjs/common";
import { Pagination } from "src/shared/utils/value-objects/pagination.value-object";
import { Pagination[NombreModulo]Dto } from "../dto/pagination-[modulo].dto";
import { [NombreEntidad]Repository } from "../../domain/repositories/[entidad].repository";
import { [NombreEntidad] } from "../../domain/entities/[entidad].entity";

@Injectable()
export class FindAll[NombreEntidad]PaginationUseCase {
    constructor(
        @Inject('[NombreEntidad]Repository')
        private readonly repository: [NombreEntidad]Repository,
    ) {}

    async execute(userId: number, status: boolean, queryPagination: Pagination[NombreModulo]Dto): Promise<any> {
        
        // 🔥 Convertir DTO → Value Object
        const pagination = new Pagination(
            queryPagination.searchValue,
            queryPagination.currentPage,
            queryPagination.pageSize,
            queryPagination.orderBy,
            queryPagination.orderByMode,
            queryPagination.custom_value
        );

        // 🔥 Llamar al repositorio con el Value Object
        const result = await this.repository.findAllPagination(userId, status, pagination);
        return result;
    }
}
```

**Ejemplo Real (entities_client)**:
```typescript
@Injectable()
export class FindAllEntityClientPaginationUseCase {
    constructor(
        @Inject('EntityClientRepository')
        private readonly entityClientRepository: EntityClientRepository,
    ) {}

    async execute(user_id: number, status: boolean, queryPagination: PaginationEntityClientDto): Promise<EntityClient[] | null> {

        const pagination = new Pagination(
            queryPagination.searchValue,
            queryPagination.currentPage,
            queryPagination.pageSize,
            queryPagination.orderBy,
            queryPagination.orderByMode,
            queryPagination.custom_value
        );

        const entitiesClient = await this.entityClientRepository.findAllPagination(user_id, status, pagination);
        return entitiesClient;
    }
}
```

---

### PASO 4: Definir Método en Repository Interface

**Ubicación**: `domain/repositories/[entidad].repository.ts`

**Firma del método**:
```typescript
import { Pagination } from 'src/shared/utils/value-objects/pagination.value-object';
import { [NombreEntidad] } from '../entities/[entidad].entity';

export interface [NombreEntidad]Repository {
    // ... otros métodos (create, update, delete, etc.)
    
    findAllPagination(
        userId: number, 
        status: boolean, 
        queryPagination: Pagination
    ): Promise<any>;
}
```

**Ejemplo Real**:
```typescript
export interface EntityClientRepository {
    create(entityClientData: Partial<EntityClient>): Promise<EntityClient | null>;
    findOne(entityClientData: Partial<EntityClient>): Promise<EntityClient | null>;
    // ...
    findAllPagination(user_id: number, status: boolean, queryPagination: Pagination): Promise<EntityClient[] | null>;
}
```

---

### PASO 5: Implementar en el Repository (Prisma)

**Ubicación**: `infraestructure/persistence/prisma-[entidad].repository.ts`

**Pasos clave**:
1. Destructurar el Value Object `Pagination`
2. Calcular `limit` y `offset` usando helpers
3. Construir query de Prisma con filtros dinámicos
4. Ejecutar query con paginación (`take`, `skip`)
5. Obtener count total en transacción
6. Formatear respuesta con metadata

**Plantilla**:
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Pagination } from 'src/shared/utils/value-objects/pagination.value-object';
import pagination from 'src/shared/utils/pagination';
import { Prisma } from '@prisma/client';
import { [NombreEntidad]Repository } from '../../domain/repositories/[entidad].repository';
import { [NombreEntidad] } from '../../domain/entities/[entidad].entity';

@Injectable()
export class Prisma[NombreEntidad]Repository implements [NombreEntidad]Repository {
    constructor(private readonly prisma: PrismaService) {}

    async findAllPagination(userId: number, status: boolean, queryPagination: Pagination): Promise<any> {
        
        // 1️⃣ Destructurar el Value Object
        const { searchValue, currentPage, pageSize, orderBy, orderByMode, custom_value } = queryPagination;
        
        // 2️⃣ Configurar ordenamiento dinámico
        const dynamicOrderBy = { [orderBy || 'created_at']: orderByMode || 'desc' };
        
        // 3️⃣ Calcular offset y limit usando helper
        const { limit, offset } = pagination.getPagination(currentPage, pageSize);

        // 4️⃣ Construir query de Prisma
        const query: Prisma.[TablaPrisma]FindManyArgs = {
            where: {
                status: status,
                user_id: userId,
                // 🔥 Filtro por búsqueda (opcional)
                ...(searchValue
                    ? {
                        OR: [
                            { name: { contains: searchValue, mode: 'insensitive' } },
                            { description: { contains: searchValue, mode: 'insensitive' } },
                            // Agrega más campos según tu modelo
                        ]
                    }
                    : {}),
                // 🔥 Filtro personalizado (opcional)
                ...(custom_value ? { category_id: custom_value } : {}),
            },
            orderBy: [dynamicOrderBy],
            take: limit,
            skip: offset,
            // 🔥 Include relaciones si es necesario
            // include: { relatedTable: true },
        };

        // 5️⃣ Ejecutar query + count en transacción
        const [items, count] = await this.prisma.$transaction([
            this.prisma.[tabla_prisma].findMany(query),
            this.prisma.[tabla_prisma].count({ where: query.where }),
        ]);

        // 6️⃣ Formatear respuesta con metadata de paginación
        const dataResponse = { rows: items, count };

        const paginatedResponse = pagination.getDataPagination(
            dataResponse,
            currentPage,
            limit
        );

        return paginatedResponse;
    }
}
```

**Ejemplo Real (entities_client)**:
```typescript
async findAllPagination(user_id: number, status: boolean, queryPagination: Pagination): Promise<any> {

    const { searchValue, currentPage, pageSize, orderBy, orderByMode, custom_value } = queryPagination;
    const dynamicOrderBy = { [orderBy || 'name']: orderByMode || 'asc' };
    const { limit, offset } = pagination.getPagination(currentPage, pageSize);

    const query: Prisma.Entities_clientFindManyArgs = {
        where: {
            status: status,
            Entities_branches: {
                some: {
                    ...(custom_value ? { branch_id: custom_value } : {}),
                    Branches: {
                        Branches_users: {
                            some: {
                                user_id: Number(user_id),
                            }
                        }
                    }
                }
            },
            ...(searchValue
                ? {
                    OR: [
                        { name: { contains: searchValue, mode: 'insensitive' } },
                        { description: { contains: searchValue, mode: 'insensitive' } },
                        { email: { contains: searchValue, mode: 'insensitive' } },
                        { location: { contains: searchValue, mode: 'insensitive' } },
                        { phone: { contains: searchValue, mode: 'insensitive' } },
                        { entity_type: { contains: searchValue, mode: 'insensitive' } },
                    ]
                }
                : {}),
        },
        orderBy: [dynamicOrderBy],
        take: limit,
        skip: offset,
        include: {
            Entities_branches: {
                where: { status: true },
                include: {
                    Branches: true
                }
            }
        }
    };

    const [entities_client, count] = await this.prisma.$transaction([
        this.prisma.entities_client.findMany(query),
        this.prisma.entities_client.count({ where: query.where }),
    ]);

    let dataEntities = { rows: entities_client, count };

    const response_entities = pagination.getDataPagination(
        dataEntities,
        currentPage,
        limit
    );

    return response_entities;
}
```

---

### PASO 6: Configurar Controller

**Ubicación**: `interfaces/controllers/[entidad].controller.ts`

**Características**:
- ✅ Usa `@Query()` para recibir parámetros de paginación
- ✅ Valida automáticamente con el DTO
- ✅ Llama al use case de paginación

**Plantilla**:
```typescript
import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { FindAll[NombreEntidad]PaginationUseCase } from '../../application/use-cases/findAll-[entidad]-pagination.use-case';
import { Pagination[NombreModulo]Dto } from '../../application/dto/pagination-[modulo].dto';

@ApiTags('[modulo]')
@Controller('[modulo]')
export class [NombreEntidad]Controller {
    constructor(
        private readonly findAllPaginationUseCase: FindAll[NombreEntidad]PaginationUseCase,
    ) {}

    // 🔥 Opción 1: Paginación con userId y status en la ruta
    @Get('pagination/:userId/:status')
    async findAllPagination(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('status') status: boolean,
        @Query() queryPagination: Pagination[NombreModulo]Dto
    ) {
        return await this.findAllPaginationUseCase.execute(userId, status, queryPagination);
    }

    // 🔥 Opción 2: Paginación simple (userId del JWT, status en query)
    @Get('pagination')
    async findAllPaginationSimple(
        @Query() queryPagination: Pagination[NombreModulo]Dto
    ) {
        // Obtén userId del JWT o contexto de autenticación
        const userId = 1; // ← Ajustar según tu sistema de auth
        const status = true;
        return await this.findAllPaginationUseCase.execute(userId, status, queryPagination);
    }
}
```

**Ejemplo Real (entities_client)**:
```typescript
@ApiTags('entities-client')
@Controller('entities-client')
export class EntitiesClientController {
    constructor(
        private readonly findAllEntityClientPaginationUseCase: FindAllEntityClientPaginationUseCase,
    ) {}

    @RequirePermissions('leer')
    @Get('findAllPagination/:user_id/:status')
    async findAllEntitiesClientPagination(
        @Param('user_id', ParseIntPipe) user_id: number,
        @Param('status') status: boolean,
        @Query() queryPagination: PaginationEntityClientDto
    ) {
        const entitiesClient = await this.findAllEntityClientPaginationUseCase.execute(user_id, status, queryPagination);
        return entitiesClient;
    }
}
```

---

### PASO 7: Registrar en el Módulo

**Ubicación**: `application/[modulo].module.ts`

```typescript
import { Module } from '@nestjs/common';
import { [NombreEntidad]Controller } from '../interfaces/controllers/[entidad].controller';
import { FindAll[NombreEntidad]PaginationUseCase } from './use-cases/findAll-[entidad]-pagination.use-case';
import { Prisma[NombreEntidad]Repository } from '../infraestructure/persistence/prisma-[entidad].repository';

@Module({
    controllers: [[NombreEntidad]Controller],
    providers: [
        // Use case de paginación
        FindAll[NombreEntidad]PaginationUseCase,
        
        // Otros use cases...
        
        // Repositorio
        {
            provide: '[NombreEntidad]Repository',
            useClass: Prisma[NombreEntidad]Repository
        },
    ],
})
export class [NombreModulo]Module {}
```

---

## 📦 HELPERS DE PAGINACIÓN

### Helper: `getPagination()`

**Ubicación**: `shared/utils/pagination.ts`

**Función**: Calcular `limit` y `offset` a partir de página y tamaño

```typescript
const getPagination = (currentPage: number, size: number) => {
    const limit = size ? +size : 10;
    const offset = currentPage ? (currentPage - 1) * limit : 0;
    return { limit, offset };
};
```

**Uso**:
```typescript
const { limit, offset } = pagination.getPagination(currentPage, pageSize);
// currentPage = 2, pageSize = 10
// → limit = 10, offset = 10
```

---

### Helper: `getDataPagination()`

**Ubicación**: `shared/utils/pagination.ts`

**Función**: Formatear respuesta con metadata de paginación

```typescript
interface DataPagination<T> {
    rows: T[];
    count: number;
}

const getDataPagination = <T>(data: DataPagination<T>, page: number, limit: number) => {
    const { count: totalItems, rows } = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);

    return {
        totalItems,
        data: rows,
        totalPages,
        currentPage,
    };
};
```

**Uso**:
```typescript
const dataResponse = { rows: items, count: totalCount };

const paginatedResponse = pagination.getDataPagination(
    dataResponse,
    currentPage,
    limit
);

// Retorna:
// {
//   totalItems: 45,
//   data: [...],
//   totalPages: 5,
//   currentPage: 2
// }
```

---

## 🌐 EJEMPLO DE REQUEST HTTP

### Endpoint
```
GET /api/entities-client/findAllPagination/1/true?currentPage=1&pageSize=10&searchValue=Marina&orderBy=name&orderByMode=asc&custom_value=5
```

### Parámetros

| Parámetro | Ubicación | Tipo | Descripción | Ejemplo |
|-----------|-----------|------|-------------|---------|
| `user_id` | Path | number | ID del usuario | `1` |
| `status` | Path | boolean | Estado activo/inactivo | `true` |
| `currentPage` | Query | number | Página actual | `1` |
| `pageSize` | Query | number | Resultados por página | `10` |
| `searchValue` | Query | string | Texto de búsqueda | `Marina` |
| `orderBy` | Query | string | Campo para ordenar | `name` |
| `orderByMode` | Query | string | Dirección del orden | `asc` / `desc` |
| `custom_value` | Query | number | Filtro personalizado | `5` |

### Respuesta

```json
{
  "totalItems": 45,
  "data": [
    {
      "id": 1,
      "name": "Marina de Guerra del Perú",
      "description": "Entidad pública",
      "email": "contacto@marina.mil.pe",
      "status": true,
      "created_at": "2024-01-15T10:30:00Z",
      "branches": [
        { "id": 5, "name": "Sede Central" }
      ]
    },
    // ... más resultados
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Paso 1: DTO
- [ ] Crear `pagination-[modulo].dto.ts` en `application/dto/`
- [ ] Agregar validaciones con `class-validator`
- [ ] Documentar con `@ApiPropertyOptional`
- [ ] Incluir: `searchValue`, `currentPage`, `pageSize`, `orderBy`, `orderByMode`
- [ ] Agregar campos personalizados si es necesario (`custom_value`, `category_id`, etc.)

### Paso 2: Use Case
- [ ] Crear `findAll-[modulo]-pagination.use-case.ts` en `application/use-cases/`
- [ ] Inyectar repositorio con `@Inject('[NombreEntidad]Repository')`
- [ ] Convertir DTO → Value Object `Pagination`
- [ ] Llamar a `repository.findAllPagination()`

### Paso 3: Repository Interface
- [ ] Agregar método `findAllPagination()` en `domain/repositories/[entidad].repository.ts`
- [ ] Firma: `findAllPagination(userId: number, status: boolean, queryPagination: Pagination): Promise<any>`

### Paso 4: Repository Implementation
- [ ] Implementar `findAllPagination()` en `infraestructure/persistence/prisma-[entidad].repository.ts`
- [ ] Destructurar Value Object `Pagination`
- [ ] Calcular `limit` y `offset` con `pagination.getPagination()`
- [ ] Construir query de Prisma con filtros dinámicos:
  - [ ] Filtro por `status`
  - [ ] Filtro por `searchValue` con `OR` y `contains`
  - [ ] Filtro personalizado con `custom_value`
  - [ ] Ordenamiento dinámico con `orderBy` y `orderByMode`
  - [ ] Paginación con `take` (limit) y `skip` (offset)
- [ ] Ejecutar query + count en `$transaction`
- [ ] Formatear respuesta con `pagination.getDataPagination()`

### Paso 5: Controller
- [ ] Agregar método en `interfaces/controllers/[entidad].controller.ts`
- [ ] Usar `@Get()` con ruta de paginación
- [ ] Recibir parámetros:
  - [ ] Path params: `@Param('userId', ParseIntPipe)`, `@Param('status')`
  - [ ] Query params: `@Query() queryPagination: Pagination[Modulo]Dto`
- [ ] Llamar a use case de paginación

### Paso 6: Módulo
- [ ] Registrar use case en `providers` de `application/[modulo].module.ts`
- [ ] Verificar que el repositorio esté registrado con token

### Paso 7: Testing
- [ ] Probar endpoint en Swagger o Postman
- [ ] Verificar respuesta con estructura:
  ```json
  {
    "totalItems": number,
    "data": array,
    "totalPages": number,
    "currentPage": number
  }
  ```
- [ ] Probar búsqueda (`searchValue`)
- [ ] Probar ordenamiento (`orderBy`, `orderByMode`)
- [ ] Probar paginación (diferentes páginas)
- [ ] Probar filtro personalizado (`custom_value`)

---

## 🚫 ERRORES COMUNES

### ❌ Error 1: No convertir DTO a Value Object
```typescript
// ❌ MAL - Pasar DTO directamente al repositorio
async execute(queryPagination: PaginationDto) {
    return await this.repository.findAllPagination(1, true, queryPagination);
}
```

```typescript
// ✅ BIEN - Convertir DTO → Value Object
async execute(queryPagination: PaginationDto) {
    const pagination = new Pagination(
        queryPagination.searchValue,
        queryPagination.currentPage,
        queryPagination.pageSize,
        queryPagination.orderBy,
        queryPagination.orderByMode,
        queryPagination.custom_value
    );
    return await this.repository.findAllPagination(1, true, pagination);
}
```

---

### ❌ Error 2: No usar transacción para query + count
```typescript
// ❌ MAL - Dos queries separadas (puede haber inconsistencia)
const items = await this.prisma.tabla.findMany(query);
const count = await this.prisma.tabla.count({ where: query.where });
```

```typescript
// ✅ BIEN - Usar $transaction
const [items, count] = await this.prisma.$transaction([
    this.prisma.tabla.findMany(query),
    this.prisma.tabla.count({ where: query.where }),
]);
```

---

### ❌ Error 3: No validar el tipo de currentPage y pageSize
```typescript
// ❌ MAL - Sin @Type() decorator
export class PaginationDto {
    @IsInt()
    @IsOptional()
    currentPage?: number; // ← Puede llegar como string desde query params
}
```

```typescript
// ✅ BIEN - Usar @Type() para transformar
export class PaginationDto {
    @IsOptional()
    @Type(() => Number)  // ← Convierte string → number
    @IsInt()
    currentPage?: number;
}
```

---

### ❌ Error 4: Olvidar valores por defecto
```typescript
// ❌ MAL - Sin valores por defecto
const { limit, offset } = pagination.getPagination(currentPage, pageSize);
// Si currentPage es undefined, offset será NaN
```

```typescript
// ✅ BIEN - Value Object con valores por defecto
export class Pagination {
    constructor(
        public readonly searchValue?: string,
        public readonly currentPage: number = 1,  // ← Default
        public readonly pageSize: number = 10,    // ← Default
        // ...
    ) {}
}
```

---

## 📚 RESUMEN

### Flujo Completo de Paginación

```
1. HTTP Request (Query Params)
   ↓
2. Controller → Recibe PaginationDto (@Query())
   ↓
3. Use Case → Convierte DTO → Value Object Pagination
   ↓
4. Repository → Usa Pagination para construir query Prisma
   ↓
5. Prisma → Ejecuta query con take/skip + count
   ↓
6. Helper → Formatea respuesta con metadata
   ↓
7. HTTP Response → { totalItems, data, totalPages, currentPage }
```

### Componentes Clave

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| **PaginationDto** | `application/dto/` | Validar entrada HTTP |
| **Pagination VO** | `shared/value-objects/` | Encapsular lógica de paginación |
| **Use Case** | `application/use-cases/` | Convertir DTO → VO, orquestar |
| **Repository** | `infraestructure/persistence/` | Implementar query con Prisma |
| **Helpers** | `shared/utils/pagination.ts` | Calcular offset/limit, formatear respuesta |

### Principios

- ✅ **Separación de capas**: DTO (HTTP) → Value Object (Domain)
- ✅ **Reutilización**: Helpers compartidos, Value Object común
- ✅ **Validación**: DTOs con class-validator
- ✅ **Consistencia**: Mismo patrón en todos los módulos
- ✅ **Metadata**: Respuesta siempre incluye totalItems, totalPages, currentPage

---

**¡Sigue este patrón para implementar paginación consistente en todos tus módulos!** 🚀
