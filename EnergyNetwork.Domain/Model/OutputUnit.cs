using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
    [DataContract(IsReference = true)]
    public class OutputUnit
    {
        [Key]
        [DataMember]
        public virtual Guid OutputUnitId
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
    }
}