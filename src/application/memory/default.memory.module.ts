import { Module } from '@nestjs/common';
import { MadiMemoryStore } from '../../core/memory/memory.contract';
import { JsonFileMemoryStore } from '../../infrastructure/memory/json-file.memory.store';
import { DefaultMemoryService } from './default.memory.service';

export const MADI_MEMORY_STORE = Symbol('MADI_MEMORY_STORE');

@Module({
  providers: [
    {
      provide: MADI_MEMORY_STORE,
      useFactory: (): MadiMemoryStore => new JsonFileMemoryStore(),
    },
    {
      provide: DefaultMemoryService,
      useFactory: (store: MadiMemoryStore) => new DefaultMemoryService(store),
      inject: [MADI_MEMORY_STORE],
    },
  ],
  exports: [MADI_MEMORY_STORE, DefaultMemoryService],
})
export class DefaultMemoryModule {}
