using System;
using System.Collections.Generic;
using Breeze.ContextProvider;

namespace EnergyNetwork.Domain.Validators
{
    public interface IBreezeValidator
    {
        bool BeforeSaveEntity(EntityInfo entityInfo);
        Dictionary<Type, List<EntityInfo>> BeforeSaveEntities(Dictionary<Type, List<EntityInfo>> saveMap);
    }
}