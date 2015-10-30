using System;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using EnergyNetwork.Domain.Repositories;

namespace EnergyNetwork.Data.Repositories
{
  /// <summary>
  /// Generic Repository
  /// </summary>
  /// <typeparam name="TEntity">The generic entity type</typeparam>
  public class Repository<TEntity>: IRepository<TEntity> where TEntity : class
  {
    protected DbContext Context { get; private set; }

    /// <summary>
    /// ctor
    /// </summary>
    /// <param name="context">Context</param>
    public Repository(DbContext context)
    {
      Context = context;
    }

    /// <summary>
    /// Get all Entities for the concrete type
    /// </summary>
    /// <returns></returns>
    public virtual IQueryable<TEntity> All()
    {
      return Context.Set<TEntity>();
    }

    /// <summary>
    /// Find Entities based on the required predicate
    /// </summary>
    /// <param name="predicate">The predicate</param>
    /// <returns></returns>
    public virtual IQueryable<TEntity> Find(Expression<Func<TEntity, bool>> predicate)
    {
      return Context.Set<TEntity>().
        Where(predicate);
    }

    public virtual IQueryable<TEntity> Get(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, string includeProperties = "")
    {
      IQueryable<TEntity> query = Context.Set<TEntity>();

      if (filter != null)
      {
        query = query.Where(filter);
      }

      foreach (var includeProperty in includeProperties.Split(new char[]{
                                                                          ','
                                                                        },
        StringSplitOptions.RemoveEmptyEntries))
      {
        query = query.Include(includeProperty);
      }

      if (orderBy != null)
      {
        return orderBy(query);
      }
      else
      {
        return query;
      }
    }

    /// <summary>
    /// Find first or default Entity
    /// </summary>
    /// <param name="predicate">The search predicate</param>
    /// <returns>The Entity</returns>
    public virtual TEntity FirstOrDefault(Expression<Func<TEntity, bool>> predicate)
    {
      return Context.Set<TEntity>().
        Where(predicate).
        FirstOrDefault();
    }


    public virtual TEntity First(Expression<Func<TEntity, bool>> filter, string includeProperties = "")
    {
      IQueryable<TEntity> query = Context.Set<TEntity>().
        Where(filter);


      foreach (var includeProperty in includeProperties.Split(new char[]{
                                                                          ','
                                                                        },
        StringSplitOptions.RemoveEmptyEntries))
      {
        query = query.Include(includeProperty);
      }

      if (query.Any())
      {
        return query.First();
      }
      return null;
    }

    /// <summary>
    /// Get Entity by identity
    /// </summary>
    /// <param name="id">The identity</param>
    /// <returns>The Entity</returns>
    public virtual TEntity GetById(Guid id)
    {
      return Context.Set<TEntity>().
        Find(id);
    }

    /// <summary>
    /// Add Entity to the working Context
    /// </summary>
    /// <param name="entity">The Entity</param>
    public virtual void Add(TEntity entity)
    {
      Context.Set<TEntity>().
        Add(entity);
    }

    /// <summary>
    /// Remove Entity to the working Context
    /// </summary>
    /// <param name="entity">The Entity</param>
    public virtual void Delete(TEntity entity)
    {
      Context.Set<TEntity>().
        Remove(entity);
      Context.SaveChanges();
    }

    /// <summary>
    /// Attach Entity to the working Context
    /// </summary>
    /// <param name="entity">The Entity</param>
    public virtual void Attach(TEntity entity)
    {
      Context.Set<TEntity>().
        Attach(entity);
    }
  }
}