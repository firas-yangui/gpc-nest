import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {subservice} from "./subservice";
import {period} from "./period";
import {phase} from "./phase";
import {storage} from "./storage";


@Entity("projectreporting" ,{schema:"public" } )
@Index("project_reporting_unicity",["period","subservice",],{unique:true})
export class projectreporting {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("timestamp with time zone",{ 
        nullable:true,
        name:"currentprojectenddate"
        })
    currentprojectenddate:Date | null;
        

    @Column("text",{ 
        nullable:true,
        name:"previoustrend"
        })
    previoustrend:string | null;
        

    @Column("text",{ 
        nullable:true,
        name:"previousperiodmainevent"
        })
    previousperiodmainevent:string | null;
        

    @Column("text",{ 
        nullable:true,
        name:"nextperiodmainevent"
        })
    nextperiodmainevent:string | null;
        

    @Column("text",{ 
        nullable:true,
        name:"alertrisk"
        })
    alertrisk:string | null;
        

   
    @ManyToOne(()=>subservice, (subservice: subservice)=>subservice.projectreportings,{  })
    @JoinColumn({ name:'subserviceid'})
    subservice:subservice | null;


   
    @ManyToOne(()=>period, (period: period)=>period.projectreportings,{  })
    @JoinColumn({ name:'periodid'})
    period:period | null;


    @Column("timestamp with time zone",{ 
        nullable:true,
        name:"initialmainmilestonedate"
        })
    initialmainmilestonedate:Date | null;
        

    @Column("timestamp with time zone",{ 
        nullable:true,
        name:"currentmainmilestonedate"
        })
    currentmainmilestonedate:Date | null;
        

    @Column("text",{ 
        nullable:true,
        name:"mainmilestone"
        })
    mainmilestone:string | null;
        

   
    @ManyToOne(()=>phase, (phase: phase)=>phase.projectreportings,{  })
    @JoinColumn({ name:'phaseid'})
    phase:phase | null;


    @Column("smallint",{ 
        nullable:true,
        name:"currentstate"
        })
    currentstate:number | null;
        

    @Column("smallint",{ 
        nullable:true,
        name:"currenttrend"
        })
    currenttrend:number | null;
        

    @Column("smallint",{ 
        nullable:true,
        name:"progressstate"
        })
    progressstate:number | null;
        

    @Column("smallint",{ 
        nullable:true,
        name:"budgetstate"
        })
    budgetstate:number | null;
        

   
    @ManyToOne(()=>storage, (storage: storage)=>storage.projectreportings,{ onDelete: 'CASCADE', })
    @JoinColumn({ name:'imageid'})
    image:storage | null;


    @Column("real",{ 
        nullable:true,
        precision:24,
        name:"initialpluriannual"
        })
    initialpluriannual:number | null;
        

    @Column("real",{ 
        nullable:true,
        precision:24,
        name:"pluriannualreforecastho"
        })
    pluriannualreforecastho:number | null;
        

    @Column("real",{ 
        nullable:true,
        precision:24,
        name:"pluriannualinitialibfs"
        })
    pluriannualinitialibfs:number | null;
        

    @Column("real",{ 
        nullable:true,
        precision:24,
        name:"pluriannualactualibfs"
        })
    pluriannualactualibfs:number | null;
        

    @Column("real",{ 
        nullable:true,
        precision:24,
        name:"pluriannualreforecastibfs"
        })
    pluriannualreforecastibfs:number | null;
        

    @Column("real",{ 
        nullable:true,
        precision:24,
        name:"elapsedtime"
        })
    elapsedtime:number | null;
        

    @Column("real",{ 
        nullable:true,
        precision:24,
        name:"achievement"
        })
    achievement:number | null;
        

    @Column("boolean",{ 
        nullable:true,
        default: () => "false",
        name:"ispublished"
        })
    ispublished:boolean | null;
        
}
