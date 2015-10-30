using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
    [DataContract(IsReference = true)]
    public class EnergySource
    {
        [Key]
        [DataMember]
        public virtual Guid EnergySourceId
        {
          get;
          set;
        }

        [DataMember]
        public virtual string Name
        {
          get;
          set;
        }

        [DataMember]
        public virtual string Description
        {
          get;
          set;
        }

        [DataMember]
        public virtual string Unit
        {
          get;
          set;
        }

        [DataMember]
        public virtual double CO2Equivalent
        {
          get;
          set;
        }

        [DataMember]
        public virtual string Color
        {
          get;
          set;
        }

    }
}