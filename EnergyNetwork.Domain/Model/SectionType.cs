using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
    [DataContract(IsReference = true)]
    public class SectionType
    {
        [Key]
        [DataMember]
        public virtual Guid SectionTypeId { get; set; }

        [DataMember]
        public virtual string Title { get; set; }

        [DataMember]
        public virtual string Description { get; set; }

        [DataMember]
        public virtual int Order { get; set; }

        [DataMember]
        public virtual string TypeName { get; set; }

        [DataMember]
        public virtual Guid SectionCategoryId { get; set; }

        [ForeignKey("SectionCategoryId")]
        [DataMember]
        public virtual SectionCategory SectionCategory
        {
            get;
            set;
        }
    }
}