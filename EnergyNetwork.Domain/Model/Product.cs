using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
    [DataContract(IsReference = true)]
    public class Product
    {
        [Key]
        [DataMember]
        public virtual Guid ProductId
        {
          get;
          set;
        }

        [Required]
        [DataMember]
        public virtual string Name
        {
          get;
          set;
        }

        [Required]
        [DataMember]
        public virtual double Amount
        {
            get;
            set;
        }

        [DataMember]
        public virtual Guid OutputUnitId { get; set; }

        [ForeignKey("OutputUnitId")]
        [DataMember]
        public virtual OutputUnit OutputUnit { get; set; }

        [DataMember]
        public virtual double FractionOfRevenue
        {
            get;
            set;
        }

        [DataMember]
        public virtual double FractionOfProcessEnergy
        {
            get;
            set;
        }

        [DataMember]
        public virtual Guid SurveyId
        {
          get;
          set;
        }

        [ForeignKey("SurveyId")]
        [DataMember]
        public virtual Survey Survey
        {
          get;
          set;
        }
    }
}