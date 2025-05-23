﻿using Microsoft.EntityFrameworkCore;
using Server.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Data.repositories
{
    public class GenericRepository<T>:IRepository<T> where T : class
    {
        private readonly DbSet<T> _dbSet;
        private readonly IDataContext _dataContext;

        public GenericRepository(DataContext context)
        {
            _dataContext = context; 
            _dbSet = context.Set<T>();
        }
        public  async Task<T> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _dataContext.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(int id)
        {
            var item=await _dbSet.FindAsync(id);
            //var user = await _dataContext.Users.FindAsync(id);
            if (item != null)
            {
                //_dataContext.Users.Remove(user);
                _dbSet.Remove(item);
                await  _dataContext.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public T? GetById(int id)
        {
            return _dbSet.Find(id);
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        

        public async virtual Task<T> UpdateAsync(int id, T entity)
        {
            var existingEntity = _dbSet.Find(id);
            if (existingEntity != null)
            {
                var properties = typeof(T).GetProperties();
                foreach (var property in properties)
                {
                    if (property.CanWrite && property.Name != "Id")
                    {
                        var newValue = property.GetValue(entity);
                        property.SetValue(existingEntity, newValue);
                    }
                }
                _dataContext.Entry(existingEntity).State = EntityState.Modified;
                await _dataContext.SaveChangesAsync();
                return existingEntity;
            }
            await _dataContext.SaveChangesAsync();
            return null;
        }
    }
}
