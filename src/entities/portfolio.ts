import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {portfolioappsettings} from "./portfolioappsettings";
import {subservice} from "./subservice";


@Entity("portfolio" ,{schema:"public" } )
@Index("uniq_english_name",["englishname",],{unique:true})
@Index("uniq_french_name",["frenchname",],{unique:true})
export class portfolio {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("text",{ 
        nullable:true,
        unique: true,
        name:"englishname"
        })
    englishname:string | null;
        

    @Column("text",{ 
        nullable:true,
        unique: true,
        name:"frenchname"
        })
    frenchname:string | null;
        

    @Column("text",{ 
        nullable:true,
        name:"currency"
        })
    currency:string | null;
        

    @Column("real",{ 
        nullable:true,
        precision:24,
        name:"rate"
        })
    rate:number | null;
        

   
    @OneToMany(()=>portfolioappsettings, (portfolioappsettings: portfolioappsettings)=>portfolioappsettings.model,{ onDelete: 'CASCADE' , })
    portfolioappsettingss:portfolioappsettings[];
    

   
    @OneToMany(()=>subservice, (subservice: subservice)=>subservice.portfolio,{ onDelete: 'SET NULL' , })
    subservices:subservice[];
    
}
