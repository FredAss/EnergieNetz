using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace EnergyNetwork.Domain.Repositories
{
  /// <summary>
  /// Contract with the  generic methods for all the Entities
  /// </summary>
  public interface IRepository<TEntity> where TEntity : class
  {
    IQueryable<TEntity> All();
    IQueryable<TEntity> Find(Expression<Func<TEntity, bool>> predicate);

    IQueryable<TEntity> Get(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, string includeProperties = "");
    TEntity FirstOrDefault(Expression<Func<TEntity, bool>> predicate);

    TEntity First(Expression<Func<TEntity, bool>> filter, string includeProperties = "");
    TEntity GetById(Guid id);

    void Add(TEntity entity);
    void Delete(TEntity entity);
    void Attach(TEntity entity);
  }
}