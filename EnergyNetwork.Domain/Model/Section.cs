using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
    [DataContract(IsReference = true)]
    public class Section
    {
        [Key]
        [DataMember]
        public virtual Guid SectionId { get; set; }

        [DataMember]
        public virtual bool Fulfilled { get; set; }

        [DataMember]
        public virtual ICollection<SectionType> SectionTypes { get; set; }

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