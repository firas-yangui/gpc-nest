import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {portfolio} from "./portfolio";
import {gpcappsettings} from "./gpcappsettings";
import {thirdparty} from "./thirdparty";


@Entity("portfolioappsettings" ,{schema:"public" } )
@Index("unique_portfolio_gpcappsettings_couple",["gpcappsettings","model",],{unique:true})
export class portfolioappsettings {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>portfolio, (portfolio: portfolio)=>portfolio.portfolioappsettingss,{  nullable:false,onDelete: 'CASCADE', })
    @JoinColumn({ name:'modelid'})
    model:portfolio | null;


   
    @ManyToOne(()=>gpcappsettings, (gpcappsettings: gpcappsettings)=>gpcappsettings.portfolioappsettingss,{  nullable:false, })
    @JoinColumn({ name:'gpcappsettingsid'})
    gpcappsettings:gpcappsettings | null;


    @Column("text",{ 
        nullable:true,
        name:"manager"
        })
    manager:string | null;
        

   
    @ManyToOne(()=>thirdparty, (thirdparty: thirdparty)=>thirdparty.portfolioappsettingss,{  nullable:false, })
    @JoinColumn({ name:'thirdpartyid'})
    thirdparty:thirdparty | null;


    @Column("text",{ 
        nullable:true,
        name:"strategicbusinesspartner"
        })
    strategicbusinesspartner:string | null;
        
}
