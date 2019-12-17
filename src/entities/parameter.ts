import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {stake} from "./stake";
import {phase} from "./phase";


@Entity("parameter" ,{schema:"public" } )
export class parameter {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:true,
        length:255,
        name:"stakename"
        })
    stakename:string | null;
        

   
    @ManyToOne(()=>stake, (stake: stake)=>stake.parameters,{ onDelete: 'SET NULL', })
    @JoinColumn({ name:'stakeid'})
    stake:stake | null;


    @Column("character varying",{ 
        nullable:true,
        length:255,
        name:"phasename"
        })
    phasename:string | null;
        

   
    @ManyToOne(()=>phase, (phase: phase)=>phase.parameters,{  })
    @JoinColumn({ name:'phaseid'})
    phase:phase | null;


    @Column("character varying",{ 
        nullable:true,
        length:255,
        name:"axisname"
        })
    axisname:string | null;
        

    @Column("character varying",{ 
        nullable:true,
        length:255,
        name:"targetaxis"
        })
    targetaxis:string | null;
        
}
