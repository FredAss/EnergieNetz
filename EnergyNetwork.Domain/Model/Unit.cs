using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
    [DataContract(IsReference = true)]
    public class Unit
    {
        [Key]
        [DataMember]
        public Guid UnitId { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string Symbol { get; set; }

        [DataMember]
        public char Dimension { get; set; }

        [ForeignKey("UnitId")]
        [DataMember]
        public Unit BasicUnit { get; set; }

        [DataMember]
        public double Coefficient { get; set; }
    }
}
