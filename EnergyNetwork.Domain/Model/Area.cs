using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
    [DataContract(IsReference = true)]
    public class Area
    {
        [Key]
        [DataMember]
        public virtual Guid AreaId
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
        public virtual double Size
        {
          get;
          set;
        }

        [DataMember]
        public virtual double HeatedFraction
        {
          get;
          set;
        }

        [DataMember]
        public virtual double ConditionedFraction
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