import { Module } from '@nestjs/common';
import { InMemoryMemoryStore } from '../../infrastructure/memory/in-memory.memory.store';
import { MadiMemoryStore } from '../../core/memory/memory.contract';
import { DefaultMemoryService } from './default.memory.service';

export const MADI_MEMORY_STORE = Symbol('MADI_MEMORY_STORE');

@Module({
  providers: [
    {
      provide: MADI_MEMORY_STORE,
      useClass: InMemoryMemoryStore,
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
