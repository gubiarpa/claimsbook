﻿using System;
using System.Collections.Generic;
using System.Text;
using yanbal.claimsbook.data.Models.Behavior;

namespace yanbal.claimsbook.data.Models
{
    public class Claimer : IGuid
    {
        public Guid ID { get; set; }
        public Guid DocumentTypeID { get; set; }
        public string DocumentNumber { get; set; }
        public string Names { get; set; }
        public string PaternalSurname { get; set; }
        public string MaternalSurname { get; set; }
        public Guid AnswerTypeID { get; set; }
        public string PhoneNumber { get; set; }
        public string EMail { get; set; }
        public string Address { get; set; }
        public Guid GeoZoneID { get; set; }
    }
}
