using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
    [DataContract(IsReference = true)]
    public class ProductionTime
    {
        [Key]
        [DataMember]
        public virtual Guid ProductionTimeId
        {
            get;
            set;
        }

        [Required]
        [DataMember]
        public virtual string Weekday
        {
            get;
            set;
        }

        [Required]
        [DataMember]
        public virtual int WorkingShifts
        {
            get;
            set;
        }

        [Required]
        [DataMember]
        public virtual double HoursPerShift
        {
            get;
            set;
        }

        [Required]
        [DataMember]
        public virtual double HoursPerDay
        {
            get;
            set;
        }

        [DataMember]
        public virtual Guid SurveyId { get; set; }

        [ForeignKey("SurveyId")]
        [DataMember]
        public virtual Survey Survey
        {
            get;
            set;
        }
    }
}
